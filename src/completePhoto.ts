// DEPLOY:    sls deploy -f completePhoto --verbose 
// LOGS:      sls logs -f completePhoto  -t
// BOTH:      sls deploy -f completePhoto --verbose && sls logs -f completePhoto  -t

import commonMiddleware, { ERROR_MESSAGE, SUCCESS_MESSAGE } from './lib/commonMiddleware';

// AWS (Now using V3 SDK)
import { DynamoDBClient, ExecuteStatementCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
const ddbClient = new DynamoDBClient({ region: process.env.REGION });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

async function completePhoto(event) {
    const  { id } = event.pathParameters;
    const { sub } = event.requestContext.authorizer.claims
    try {
        const tableName = process.env.PHOTOS_TABLE_NAME;
        const Statement = `UPDATE "${tableName}" SET uploadStatus=? WHERE userId=? AND id=?`
        const Parameters = [{ S: "COMPLETE" }, { S: sub }, { S: id }];
        const params = {Statement, Parameters};
        await ddbDocClient.send(new ExecuteStatementCommand(params));

    } catch (error) {
        return ERROR_MESSAGE(error);
    }    

    return SUCCESS_MESSAGE({ success: true });
}

export const handler = commonMiddleware(completePhoto)
// No validator required for this API route.


