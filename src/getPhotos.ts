// DEPLOY:    sls deploy -f getPhotos --verbose
// LOGS:      sls logs -f getPhotos  -t
// BOTH:      sls deploy -f getPhotos --verbose && sls logs -f getPhotos  -t

import AWS from "aws-sdk";
import commonMiddleware, { ERROR_MESSAGE, SUCCESS_MESSAGE } from "./lib/commonMiddleware";
import validator from "@middy/validator";
import getPhotosSchema from "./schemas/getPhotosSchema";
import { getBucketName, getSignedUrl, S3_METHODS } from "./lib/s3-utils";

const dynamodb = new AWS.DynamoDB();

interface iPhotos {
  sizes: [];
  url: string;
  id: string;
  originalName: string;
}

async function getPhotos( event ) {
  const { uploadStatus } = event.queryStringParameters; // Defaults to COMPLETE by middy if nothing passed over
  const { sub } = event.requestContext.authorizer.claims;
  const bucket = getBucketName();

  let photos : iPhotos[] = [];

  try {

    const tableName = process.env.PHOTOS_TABLE_NAME;
    const Statement = `SELECT * FROM "${tableName}" WHERE userId=? AND uploadStatus=?`
    const Parameters = [{ S: sub }, { S: uploadStatus }];
    const params = {Statement, Parameters};
    const results : any = await dynamodb.executeStatement(params).promise();
    photos = results.Items.map(AWS.DynamoDB.Converter.unmarshall)

    
   
    //Lets add the presigned urls to the photos 
    photos = await Promise.all(
        photos.map(async (photo) => {
            const sizes = photo.sizes;
            const preSignedGetUrls = await Promise.all(
                sizes.map(async (size) => {
                    const key = `${sub}/${photo.id}/${size}/${photo.originalName}`;
                    const url = await getSignedUrl(bucket, key, S3_METHODS.get, process.env.REGION);
                    return { size, url };
                })
            )
            return { ...photo, preSignedGetUrls };
        })  
    );
  } catch (error : any) {
    return ERROR_MESSAGE(error);
  }

  return SUCCESS_MESSAGE({photos});
}

export const handler = commonMiddleware(getPhotos).use(
  validator({
    inputSchema: getPhotosSchema,
    ajvOptions: {
      useDefaults: true,
      strict: true,
    },
  })
)
