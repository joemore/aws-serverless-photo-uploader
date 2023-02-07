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

## Photo Uploader Frontend

Repo: [github.com/joemore/aws-serverless-photo-uploader-frontend-nextjs](https://github.com/joemore/aws-serverless-photo-uploader-frontend-nextjs)
