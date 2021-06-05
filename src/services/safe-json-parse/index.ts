/**
 * Simple function to treat if JSON is valid,
 * so it won't throw a error if not
 *
 * @author Wellington Viveiro <wviveiro@gmail.com>
 **/
// eslint-disable-next-line
export function safeJsonParse<T>(json: string) : T | false {
    try {
        const result:T = JSON.parse(json);
        return result;
    } catch (error) {
        return false;
    }
}
