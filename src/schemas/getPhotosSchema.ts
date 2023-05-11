const getPhotosSchema = {
    type: 'object',
    properties: {
        queryStringParameters: {
            type: 'object',
            properties: {
                uploadStatus: { 
                    type: 'string',
                    enum: ['PENDING','UPLOADING','COMPLETE'],
                    default: 'COMPLETE', //Uses this if nothing passed over
                },
                next: { type: 'string' }, // This is the NextToken for paginating through the results
            },
            required: ['uploadStatus'],
        },
    },
    required: ['queryStringParameters'],
};

export default getPhotosSchema;