// DEPLOY:    sls deploy -f deletePhoto --verbose
// LOGS:      sls logs -f deletePhoto  -t
// BOTH:      sls deploy -f deletePhoto --verbose && sls logs -f deletePhoto  -t

import validator from "@middy/validator";

import commonMiddleware, { ERROR_MESSAGE, SUCCESS_MESSAGE } from "./lib/commonMiddleware";
import { getPhotoByID } from "./lib/dynamodb-utils";
import { deleteS3File, getBucketName } from "./lib/s3-utils";
import deletePhotoSchema from "./schemas/deletePhotoSchema";


// AWS (Now using V3 SDK)
import { DynamoDBClient, ExecuteStatementCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
const ddbClient = new DynamoDBClient({ region: process.env.REGION });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);


const tableName = process.env.PHOTOS_TABLE_NAME;



async function deletePhoto( event ) {
  const { id } = event.pathParameters; // ID of our photo to delete (and it's crops)
  const { sub } = event.requestContext.authorizer.claims; //Sub is basically the user id
  const bucket = getBucketName();

  let photo = await getPhotoByID(sub, id);

  if( !photo ){
    return ERROR_MESSAGE(`Could not delete - please check the ID or permissions are correct! ID:${id}`);
  }  
  try {

    // Delete from DynamoDB
    const Statement = `DELETE FROM "${tableName}" WHERE userId=? AND id=?`
    const Parameters = [{ S: sub }, { S: id }];
    const params = {Statement, Parameters};
    await ddbDocClient.send(new ExecuteStatementCommand(params));


    // Delete from S3
    const sizes = photo.sizes;
    await Promise.all(
      sizes.map(async (size) => {
        const key = `${sub}/${photo.id}/${size}/${photo.originalName}`;
        await deleteS3File(bucket, key, process.env.REGION);
      })
    );

  } catch (error) {
    return ERROR_MESSAGE(error);
  }

  return SUCCESS_MESSAGE({message: `Photo deleted successfully!`});
}

export const handler = commonMiddleware(deletePhoto).use(
  validator({
    inputSchema: deletePhotoSchema,
    ajvOptions: {
      useDefaults: true,
      strict: true,
    },
  })
);
