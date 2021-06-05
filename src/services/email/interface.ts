export type Provider = "mailchimp" | "sendgrid";

export interface Email {
    to: string[],
    subject: string,
    body: string,
    cc?: string[],
    bcc?: string[]
};

export interface Recipient {
    email: string,
    name?: string,
    type: string
}

export interface MailChimpResult {
    email: string,
    status: string,
    _id: string,
    reject_reason: string | null
}

export interface MailchimpError {
    message: string,
    name: "Error"
}