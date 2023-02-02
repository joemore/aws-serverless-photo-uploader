const deletePhotoSchema = {
    type: 'object',
    properties: {
        queryStringParameters: {
            type: 'object',
            properties: {
                delete: { 
                    type: 'string',
                    enum: ['TRUE'], // user needs to send over ?delete=TRUE in the querystring (added as a simple example of using middy)
                },
            },
            required: ['delete'],
        },
    },
    required: ['queryStringParameters'],
};

export default deletePhotoSchema;