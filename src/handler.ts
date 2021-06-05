export const ping = async () => ({
    statusCode: 200,
    body: JSON.stringify({
        message: 'PONG',
        success: true
    })
});