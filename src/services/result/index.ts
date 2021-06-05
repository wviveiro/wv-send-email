import type {Result, Body, Response} from './interface';

/**
 * Result object
 * 
 * Used to output a response from a serverless function
 */
export const result: Result = {
    success: (response?: string | Body): Response => {
        if (typeof response === 'string' || typeof response === 'undefined') {
            const body:Body = {
                success: true,
                message: response || "Done"
            }

            return {
                statusCode: 200,
                body: JSON.stringify(body)
            }
        }

        response.success = true;

        return {
            statusCode: 200,
            body: JSON.stringify(response)
        } 
    },
    failure: (response: string | Body): Response => {
        if (typeof response === 'string') {
            const body:Body = {
                success: false,
                message: response
            }

            return {
                statusCode: 500,
                body: JSON.stringify(body)
            }
        }

        response.success = false;

        return {
            statusCode: 500,
            body: JSON.stringify(response)
        } 
    }
}

export {Response}