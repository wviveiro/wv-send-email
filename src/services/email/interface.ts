export type Provider = "mailchimp" | "sendgrid";

export interface Email {
    to: string[],
    subject: string,
    body: string,
    cc?: string[],
    bcc?: string[]
}

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

export interface SGResult {
    statusCode: number,
    // eslint-disable-next-line
    body: any
}

export interface SGEmailData {
    email: string,
    name?: string
}

export interface SGMessage {
    from: {
        email: string,
        name?: string
    },
    to: SGEmailData[],
    cc?: SGEmailData[],
    bcc?: SGEmailData[],
    subject: string,
    text: string
}