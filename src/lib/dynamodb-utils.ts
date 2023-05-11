
import { ERROR_MESSAGE } from "./commonMiddleware";

// AWS (Now using V3 SDK)
import { DynamoDBClient, ExecuteStatementCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
const ddbClient = new DynamoDBClient({ region: process.env.REGION });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);


const tableName = process.env.PHOTOS_TABLE_NAME;

export const getPhotoByID = async (userId : string, id : string) => {
    try {
      const Statement = `SELECT * FROM "${tableName}" WHERE userId=? AND id=?`
      const Parameters = [{ S: userId }, { S: id }];
      const params = {Statement, Parameters};
      const result : any = await ddbDocClient.send(new ExecuteStatementCommand(params));
      const photo = result?.Items.map(unmarshall)[0] || null;

      return photo;
    } catch (error) {
        ERROR_MESSAGE(error, {throwError: true})
    }
};