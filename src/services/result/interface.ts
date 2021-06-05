
// Used for serverless as response
export interface Response {
    statusCode: 200 | 500 | 404, // Limiting the statuses for now
    body: string
}

// Main output of API. Can be a json with any value
export interface Body {
    // eslint-disable-next-line
    [x: string]: any
}


// Module Result type
export interface Result {
    success: (response?: string | Body ) => Response,
    failure: (response: string | Body) => Response
}