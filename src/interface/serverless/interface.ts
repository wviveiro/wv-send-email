// Serverless does not have a clear documentation of types, so let's create a generic one
export interface ServerlessEvent {
    /** Body of a POST request */
    body: string,
    // eslint-disabled-next-line
    [x: string]: any
}