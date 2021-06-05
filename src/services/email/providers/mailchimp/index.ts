import env from "../../../../constants";
import type { Email, MailchimpError, MailChimpResult, Recipient } from "../../interface";
import mailchimp from "@mailchimp/mailchimp_transactional";
import type { MailchimpResult } from "@mailchimp/mailchimp_transactional";


/**
 * Send email using mailchimp API
 * @param args 
 * @returns 
 */
export const sendEmailMailchimp = async ({to, subject, body, cc, bcc}: Email): Promise<MailchimpResult[]> => {
    const {MAILCHIMP_API_KEY, MC_FROM_EMAIL} = env;

    if (!MAILCHIMP_API_KEY) throw new Error('Invalid Mailchimp KEY');
    if (!MC_FROM_EMAIL) throw new Error('Invalid Mailchimp From Email');


    let recipients: Recipient[] = [
        ...organiseRecipients("to", to),
        ...(cc ? organiseRecipients("cc", cc) : []),
        ...(bcc ? organiseRecipients("bcc", bcc) : []),
    ];

    const result: MailChimpResult[] | MailchimpError = await mailchimp(MAILCHIMP_API_KEY).messages.send({
        message: {
            text: body,
            subject,
            from_email: MC_FROM_EMAIL,
            to: recipients
        }
    });

    if (!Array.isArray(result)) {
        throw new Error(`Something went wrong trying to send message by Mailchimp: ${result ? result.message : 'Unknown Error'}`);
    }
    
    return result;
}


/**
 * Create list of recipients based on Mailchimp structure
 * @param type 
 * @param emails 
 * @returns Recipient[]
 */
 const organiseRecipients = (type: "to" | "cc" | "bcc" , emails: string[]): Recipient[] => emails.map(email => {
    return {
        email,
        type
    }
});