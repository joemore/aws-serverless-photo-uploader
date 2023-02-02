// DEPLOY:    sls deploy -f insertPhoto --verbose 
// LOGS:      sls logs -f insertPhoto  -t
// BOTH:      sls deploy -f insertPhoto --verbose && sls logs -f insertPhoto  -t

import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import commonMiddleware, { ERROR_MESSAGE, SUCCESS_MESSAGE } from './lib/commonMiddleware';
import validator from '@middy/validator';
import insertPhotoSchema from './schemas/insertPhotoSchema';
import { getBucketName, getSignedUrl, S3_METHODS } from './lib/s3-utils';

const dynamodb = new AWS.DynamoDB();

async function insertPhotoFunction(event) {
  const { originalName, creationDate, sizes, color1x1 } = event.body; // body will be parsed by middy
  const { sub } = event.requestContext.authorizer.claims

  const now = new Date();
  const id = uuid();
  const bucket = getBucketName();
  
  //Lets create our presigned PUT URL's based on the sizes we have been sent over
  const preSignedPutUrls = await Promise.all(
      sizes.map(async (size) => {
        const key = `${sub}/${id}/${size}/${originalName}`;
        const url = await getSignedUrl(bucket, key, S3_METHODS.put, process.env.REGION);
        return { size, url };
      })
  )

  // We need to marshal our input data to DynamoDB
  const marshalled = AWS.DynamoDB.Converter.marshall({
    userId: sub,
    id: id,
    originalName: originalName,
    uploadStatus: "PENDING",
    sizes: sizes,
    creationDate: creationDate,
    lastUpdate: now.getTime().toString(),
    color1x1: color1x1,
  });

  try {
      const tableName = process.env.PHOTOS_TABLE_NAME;
      const Statement = `INSERT INTO "${tableName}"
        value {
          'userId': ?,
          'id': ?,
          'originalName': ?,
          'uploadStatus': ?,
          'sizes': ?,
          'creationDate': ?,
          'lastUpdate': ?,
          'color1x1': ?
        }`
      const Parameters = [
          marshalled.userId, 
          marshalled.id, 
          marshalled.originalName,
          marshalled.uploadStatus,
          marshalled.sizes,
          marshalled.creationDate,
          marshalled.lastUpdate,
          marshalled.color1x1
        ];
      const params = {Statement, Parameters};
      await dynamodb.executeStatement(params).promise()
  } catch (error) {
      return ERROR_MESSAGE(error)
  }        

  return SUCCESS_MESSAGE({ id, preSignedPutUrls })
}

export const handler = commonMiddleware(insertPhotoFunction)
.use( validator({ 
  inputSchema: insertPhotoSchema,
  ajvOptions: {
    useDefaults: true,
    strict: true,
  },
}));


