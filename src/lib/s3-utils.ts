import AWS from 'aws-sdk';
import mime from 'mime-types';

// Useful S3 Functions we can use globally in our code

interface iS3Params {
    Bucket: string;
    Key: string;
    Expires: number;
    ContentType?: string;
}

export const S3_METHODS : { get: string, put: string } = {
    get: 'getObject',
    put: 'putObject'
};

export const getSignedUrl = async (bucket, key, method = S3_METHODS.get, region, expires = 300) => {
    return new Promise((resolve, reject) => {
        const s3 = new AWS.S3({ region });
        const params : iS3Params = {
            Bucket: bucket,
            Key: key,
            Expires: expires,
        };
        if (method === S3_METHODS.put ) {
            params.ContentType = mime.lookup(key);
        }
        s3.getSignedUrl(method, params, function (err, url) {
            if (err) {
                reject(err);
            }
            else {
                resolve(url);
            }
        });
    });
};

// If we have dynamic buckets this function will be useful
export const getBucketName = () => {
    return `${process.env.S3_BUCKET}`;
};


// Delete a file from S3 function
export const deleteS3File = async (bucket, fileKey, region) => {
    const s3 = new AWS.S3({ region });
    const deleteS3 = await s3
      .deleteObject({
        Bucket: bucket,
        Key: fileKey,
      })
      .promise();
    return deleteS3;
  };