import AWS from "aws-sdk";
import { ERROR_MESSAGE } from "./commonMiddleware";

const dynamodb = new AWS.DynamoDB();
const tableName = process.env.PHOTOS_TABLE_NAME;

export const getPhotoByID = async (userId : string, id : string) => {
    try {
      const Statement = `SELECT * FROM "${tableName}" WHERE userId=? AND id=?`
      const Parameters = [{ S: userId }, { S: id }];
      const params = {Statement, Parameters};
      const result : any = await dynamodb.executeStatement(params).promise();
      const photo = result?.Items.map(AWS.DynamoDB.Converter.unmarshall)[0] || null;
      return photo;
    } catch (error) {
        ERROR_MESSAGE(error, {throwError: true})
    }
};