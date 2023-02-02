// DEPLOY:    sls deploy -f completePhoto --verbose 
// LOGS:      sls logs -f completePhoto  -t
// BOTH:      sls deploy -f completePhoto --verbose && sls logs -f completePhoto  -t

import AWS from 'aws-sdk';
import commonMiddleware, { ERROR_MESSAGE, SUCCESS_MESSAGE } from './lib/commonMiddleware';

const dynamodb = new AWS.DynamoDB();

async function completePhoto(event) {
    const  { id } = event.pathParameters;
    const { sub } = event.requestContext.authorizer.claims
    try {
        const tableName = process.env.PHOTOS_TABLE_NAME;
        const Statement = `UPDATE "${tableName}" SET uploadStatus=? WHERE userId=? AND id=?`
        const Parameters = [{ S: "COMPLETE" }, { S: sub }, { S: id }];
        const params = {Statement, Parameters};
        await dynamodb.executeStatement(params).promise()
    } catch (error) {
        return ERROR_MESSAGE(error);
    }    

    return SUCCESS_MESSAGE({ success: true });
}

export const handler = commonMiddleware(completePhoto)
// No validator required for this API route.


