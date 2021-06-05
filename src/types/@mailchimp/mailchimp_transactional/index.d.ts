declare module '@mailchimp/mailchimp_transactional' {
    type Recipient = {
        email: string,
        name?: string,
        type: "to", "cc", "bcc"
    }

    type InnerMessage = {
        text: string,
        subject: string,
        from_email: string,
        to: Recipient[]
    }

    type Message = {
        message: InnerMessage
    }

    export type MailchimpResult = {
        email: string,
        status: string,
        _id: string,
        reject_reason: string | null
    }
    
    export type MailchimpError = {
        message: string,
        name: "Error"
    }

    declare function send(args: Message): MailchimpResult | MailchimpError;

    export default function fn(key: string): {
        messages: {
            send
        }
    };
}