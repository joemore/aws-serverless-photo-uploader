# Photo Uploader Project (Backend)



<p align="center">
  <img src="https://cdn.3dnames.co/uploads/joemore.com/blogs/photo-uploader/photo-uploader-infrastructure-2-md.webp" width="350" title="Pink Monkey Photo Uploader">
</p>

Please note - this is part of an open source, full stack project - you can read the full details of this project here
[joemore.com/photo-uploader-with-aws-serverless-nextjs-and-tailwind/](https://www.joemore.com/photo-uploader-with-aws-serverless-nextjs-and-tailwind/)

This works in conjunction with the NextJS Front end website  - you can find the backend code here
[Frontend Repo](https://github.com/joemore/aws-serverless-photo-uploader-frontend-nextjs)

Here is an overview of what this backend script spins up:

<p align="center">
  <img src="https://cdn.3dnames.co/uploads/joemore.com/blogs/photo-uploader/aws-architecture-lg.webp" width="500" title="AWS Overview">
</p>

## Prerequisites

1. Run `yarn global add serverless` to install the serverless framework to your system
1. Run `yarn install` to install the dependencies

## Photo Uploader Backend

This Repo: [github.com/joemore/aws-serverless-photo-uploader](https://github.com/joemore/aws-serverless-photo-uploader)

First, copy `.env.example` to `.env` and fill in the values

```bash
YOUR_AWS_IAM_PROFILE=XXXXXXXXXXX
REGION=us-east-1
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
sls deploy -s dev && bash echo-outputs.sh -s dev
```

Note: If you change the stage (-s flag) to say `prod` then it will deploy a separate stack with S3, DynamoDB and Cognito pool names all ending with -prod instead of -dev

After deploying, the `bash echo-outputs.sh -s dev` script will output all required inputs for your frontend's Environment variables, for example

```bash
NEXT_PUBLIC_AWS_REGION=xx-xxxx-1
NEXT_PUBLIC_AWS_USER_POOL_ID=xx-xxxx-1_123456789
NEXT_PUBLIC_AWS_USER_POOL_WEB_CLIENT_ID=abdef0123456789012345
NEXT_PUBLIC_AWSAPIENDPOINT=https://xxxxxxxx.execute-api.xx-xxxx-1.amazonaws.com/dev
```

You can copy this output and paste it into your frontend's `.env.local` file!

## Photo Uploader Frontend

Repo: [github.com/joemore/aws-serverless-photo-uploader-frontend-nextjs](https://github.com/joemore/aws-serverless-photo-uploader-frontend-nextjs)

## Removing the backend stack

To remove the backend, run the following command (Not you may need to manually empty your buckets first!)

```bash
sls remove --stage dev
```


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

...although its a bit bulkier to import, it's much more efficient and we can also use the new ES6 import syntax, plus full TypeScript support.

2) I also updated the getPhotos function to make use of the NextToken - if one exists then we pass it back to our front end script, which in turn passes it back to the backend to get the next set of results. I've also set the Limit to 10 results at a time so that we can paginate through by clicking the "Load more" button - in a realworld example we would probably set this to 100 or more and also set it to load as the users gets to the bottom of the page.


## Version 1.0.2 Update

* Added `echo-outputs.sh` script to output the required environment variables for the frontend
* Updated better stage management - now you can deploy to `dev` or `prod` and it will create a separate stack for each