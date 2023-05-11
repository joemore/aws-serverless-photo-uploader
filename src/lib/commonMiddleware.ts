import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer'
import JSONErrorHandlerMiddleware from 'middy-middleware-json-error-handler' // Prettier JSON Errors
import cors from '@middy/http-cors'
import createError from "http-errors";

export default handler => middy(handler)
.use([ 
    httpJsonBodyParser(), 
    httpEventNormalizer(), 
    JSONErrorHandlerMiddleware(),
    cors(),
])

interface errorOptions {
    message?: string;
    statusCode?: number;
    throwError?: boolean;
}
export const ERROR_MESSAGE = ( 
    error : any, 
    options : errorOptions | null = null
) => {
    // Throw Server Error
    if( options?.throwError === true ){
        console.error('❌🛑❗️',error);
        throw new createError.InternalServerError(error);
    }
    // Give client more friendly errors back
    return {
        statusCode: options?.statusCode || 502,
        body: JSON.stringify( {
            message: options?.message || "Server Error", 
            error: typeof error === "string" ? error : error.message
        }),
      }
}

export const SUCCESS_MESSAGE = (
    object : any,
    statusCode : number = 200
) => {
    return {
        statusCode,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(object),
    }
}

