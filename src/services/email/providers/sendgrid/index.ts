import env from "../../../../constants";
import sendgrid from "@sendgrid/mail";
import type { Email, SGResult, SGEmailData } from "../../interface";
import type { MailDataRequired } from "@sendgrid/mail";

/**
 * Send email using Sendgrid API
 * @param args 
 * @returns 
 */
export const sendEmailSendGrid = async (args: Email): Promise<SGResult> => {
    const {SENDGRID_API_KEY, SG_FROM_EMAIL} = env;

    if (!SENDGRID_API_KEY) throw new Error('Invalid Send Grid KEY');
    if (!SG_FROM_EMAIL) throw new Error('Invalid Send Grid From Email');


    const to: SGEmailData[] = args.to.map(email => ({email}));
    const cc: SGEmailData[] = args.cc ? args.cc.map(email => ({email})) : [];
    const bcc: SGEmailData[] = args.bcc ? args.bcc.map(email => ({email})) : [];

    const message: MailDataRequired = {
        from: {
            email: SG_FROM_EMAIL
        },
        subject: args.subject,
        text: args.body,
        to,
        cc,
        bcc
    }


    sendgrid.setApiKey(SENDGRID_API_KEY);
    const [result] = await sendgrid.send(message);

    if (!result || !result.statusCode) {
        throw new Error(`Something went wrong trying to send the email through Sendgrid`);
    }
    
    return {
        statusCode: result.statusCode,
        body: result.body
    }
}