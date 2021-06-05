import {validate} from 'email-validator';
import { result } from '../result';
import { safeJsonParse } from '../safe-json-parse';
import { sendEmailMailchimp } from './providers/mailchimp';
import { sendEmailSendGrid } from './providers/sendgrid';
import { MailchimpResult } from '@mailchimp/mailchimp_transactional';
import type { Email, Provider, SGResult } from './interface';
import type { Response, Body } from '../result/interface';
import type { ServerlessEvent } from '../../interface/serverless/interface';

/**
 * Function to send email using Mailchimp or Sendgrid
 *
 * @author Wellington Viveiro <wviveiro@gmail.com>
 **/
export const sendEmail = async (provider:Provider, {to, subject, body, cc, bcc}: Email): Promise<SGResult | MailchimpResult[]> => {
    // Check if provider is correct
    if (!["mailchimp", "sendgrid"].includes(provider)) {
        throw new Error("Invalid Provider");
    }

    // Treat Content
    body = body.trim();
    subject = subject.trim();

    if (!body) throw new Error("Invalid content of email");
    if (!subject) throw new Error("Invalid subject of email");
    if (!to.length) throw new Error("Invalid list of recipients");

    to = checkValidEmails("to", to);
    if (cc && cc.length) cc = checkValidEmails("cc", cc);
    if (bcc && bcc.length) bcc = checkValidEmails("bcc", bcc);

    if (provider === "mailchimp") {
        // Send email using mailchimp provider
        const result = await sendEmailMailchimp({
            to,
            subject,
            body,
            cc,
            bcc
        });

        return result;
    } else if (provider === "sendgrid") {
        // Send email using sendgrid provider
        const result = await sendEmailSendGrid({
            to,
            subject,
            body,
            cc,
            bcc
        });

        return result;
    }


    throw new Error("No provider found");
}

/**
 * Check if emails of list are valid
 * @param type - type of list 
 * @param emails - list of emails
 * @returns string[]
 */
const checkValidEmails = (type: "to" | "cc" | "bcc" , emails: string[]): string[] => emails.map(email => {
    if (!validate(email.trim())) throw new Error(`Invalid email list (${type})`);

    return email.trim();
});


export const email = async (event: ServerlessEvent): Promise<Response> => {
    const eventBody: Body | false = <Body>safeJsonParse(event.body);

    if (!eventBody) return result.failure('Invalid request');

    const {to, subject, body, cc, bcc, provider} = eventBody;

    try {
        const message = await sendEmail(provider, {
            to,
            subject,
            body,
            cc,
            bcc
        });

        return result.success({message});
    } catch (error) {
        return result.failure(error.message);
    }
}