# Photo Uploader Project

Please note - this is part of an open source project written by me, Joe Gilmore - you can read the full details of this project here
[joemore.com/photo-uploader-with-aws-serverless-nextjs-and-tailwind/](https://www.joemore.com/photo-uploader-with-aws-serverless-nextjs-and-tailwind/)

This works in conjunction with the NextJS Front end website  - you can find the backend code here
[Frontend Repo](https://github.com/joemore/aws-serverless-photo-uploader-frontend-nextjs)

## Prerequisites

1. Run `npm install -g serverless` to install the serverless framework
1. Run `yarn install` to install the dependencies

## Photo Uploader Backend

This Repo: [github.com/joemore/aws-serverless-photo-uploader](https://github.com/joemore/aws-serverless-photo-uploader)

First, copy `.env.example` to `.env` and fill in the values

```bash
YOUR_AWS_IAM_PROFILE=XXXXXXXXXXX
REGION=sa-east-1n
PREFIX=pinkmonkey-
SERVICE_NAME=photo-uploader
DYNAMO_DB_TABLE=photos
COGNITO_POOL=users
S3_BUCKET=photos-bucket
```

Note about the PREFIX - this is optional, but if like me you have many AWS resources then by prefixing your resources like this you can locate them easier, and they may make more sense to you when you come back to them after a long time. 

## Deploying the backend

Run the following commands to deploy the backend

```bash
sls deploy
```

Once your service has deployed, you need to copy the USER_POOL_ID, USER_POOL_CLIENT_ID and API Endpoint values. You will need these for the frontend.

## Note about reading back Stack Values

If you need to read back the values of your stack, you can do so by running the following command

```bash
aws cloudformation --profile YOURPROFILE  --region us-east-1 describe-stacks --stack-name yourStackName --query "Stacks[0].Outputs" 
```

## Photo Uploader Frontend

Repo: [github.com/joemore/aws-serverless-photo-uploader-frontend-nextjs](https://github.com/joemore/aws-serverless-photo-uploader-frontend-nextjs)




## Version 1.0.1 Update

1) In this update I removed the aws-sdk V2 and replaced it with the updated aws-sdk-v3. V3 offers Modularized packages as well as being written in written in TypeScript and supports Promises.

With version 2 we were required to import the entire SDK which can be unnecessary bloat if you are not using many services, with V3 we can import only the services we need.

```js
var AWS  = require("aws-sdk");
```

...is now replaced with something like this:

```js
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { DynamoDBClient, ExecuteStatementCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
```

...although I do not like its not as clean as V2, it is a lot more efficient.

2) I also updated the getPhotos function to make use of the NextToken - if one exists then we pass it back to our front end script, which in turn passes it back to the backend to get the next set of results. I've also set the Limit to 10 results at a time so that we can paginate through by clicking the "Load more" button - in a realworld example we would probably set this to 100 or more and also set it to load as the users gets to the bottom of the page.
