import { S3Client , GetObjectCommand, DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

interface iS3Params {
    Bucket: string;
    Key: string;
    ContentType?: string;
}

export const S3_METHODS : { get: string, put: string } = {
    get: 'getObject',
    put: 'putObject'
};

export const getSignedUrlUtil = async (bucket, key, method = S3_METHODS.get, region, expires = 300) => {
    const s3 = new S3Client({ region });
    const params : iS3Params = {
        Bucket: bucket,
        Key: key,
    };
    const command = method === S3_METHODS.put ? new PutObjectCommand(params) : new GetObjectCommand(params);
    const url = await getSignedUrl(s3, command, { expiresIn: expires }); // expires in seconds
    return url;
};



// If we have dynamic buckets this function will be useful
export const getBucketName = () => {
    return `${process.env.S3_BUCKET}`;
};


// Delete a file from S3 function
export const deleteS3File = async (bucket, fileKey, region) => {
    const s3 = new S3Client({ region });
    const params = { // DeleteObjectRequest
        Bucket: bucket, // required
        Key: fileKey, // required
      };
    const command = new DeleteObjectCommand(params);
    const deleteS3 = await s3.send(command);
    return deleteS3;
  };