const schema = {
    type: 'object',
    properties: {
        body: {
            type: 'object',
            properties: {
                originalName: { 
                    type: 'string',
                },
                creationDate: {
                    type: 'string',
                },
                sizes : {
                    type: 'array',
                    items: {
                        type: 'string',
                    }
                },
                // extraRequiredThing : {
                //     type: 'string',
                // }
            },
            required: ['originalName','sizes','creationDate'],
        },
    },
    required: ['body'],
};

export default schema;