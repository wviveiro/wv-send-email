import { email, sendEmail } from ".";
import env from "../../constants";
import sendgrid from "@sendgrid/mail";

// Mock of variables
jest.mock("../../constants", () => ({
    MAILCHIMP_API_KEY: "foo",
    MC_FROM_EMAIL: "bar",
    SENDGRID_API_KEY: 'foo',
    SG_FROM_EMAIL: "bar",
}));

// Mock mailchimp function
const mailchimpSpy = jest.fn();
jest.mock("@mailchimp/mailchimp_transactional", () => jest.fn().mockImplementation(() => ({
    messages: {
        send: mailchimpSpy
    }   
})));

// Mock sendgrid function
jest.mock("@sendgrid/mail", () => ({
    setApiKey: jest.fn(),
    send: jest.fn(),
}));


describe("Email Service", () => {
    test("Verify if lack of intormation throws error", async () => {
        const args = {
            to: [],
            body: "",
            subject: ""
        }

        await expect(sendEmail("sendgrid", args)).rejects.toThrow();
    });

    test("Check if invalid email is catched", async () => {
        const args = {
            to: ["foo"],
            body: "bar",
            subject: "bar"
        }

        await expect(sendEmail("sendgrid", args)).rejects.toThrow("Invalid email list (to)");
    });

    describe("Test Mailchimp API", () => {
        const args = {
            to: ["foo@bar.com"],
            subject: "Foo",
            body: "foo"
        }

        test("Check if mailchimp is being called", async () => {
            const result = [{
                email: "foo@bar.com"
            }];
    
            mailchimpSpy.mockReturnValue(result);
    
            await expect(sendEmail("mailchimp", args)).resolves.toBe(result);
    
            expect(mailchimpSpy).toHaveBeenCalledWith({message: {
                from_email: env.MC_FROM_EMAIL,
                subject: args.subject,
                text: args.body,
                to: [{email: "foo@bar.com", type: "to"}],
            }})
        });

        test("Check if mailchimp throws", async () => {

            const result =  {message: 'Error'};
            mailchimpSpy.mockReturnValue(result);
    
            await expect(sendEmail("mailchimp", args)).rejects.toThrow();
        });

        test("Test Serverless function using mailchimp", async () => {

            mailchimpSpy.mockReturnValue([{email: 'foo'}]);

            const expected = await email({body: JSON.stringify({
                "provider": "mailchimp",
                "to": ["foo@bar.com"],
                "subject": "This is a test",
                "body": "Testing Sendgrid API"
            })});


            expect(expected).toEqual({statusCode: 200, body: expect.anything()});
        });
    });

    describe("Test Sendgrid API", () => {
        const args = {
            to: ["foo@bar.com"],
            subject: "Foo",
            body: "foo"
        }

        const result = [{
            statusCode: 200,
            body: 'Ok'
        }];

        const sendgridSpy = jest.spyOn(sendgrid, "send");

        test("Check if sendgrid is being called", async () => {
            

            // Force result just to check if is being called
            // eslint-disable-next-line
            sendgridSpy.mockReturnValue(<any>result);

            await expect(sendEmail("sendgrid", args)).resolves.toStrictEqual(result[0]);

            expect(sendgridSpy).toHaveBeenCalled();
        });

        test("Check if sendgrid throws", async () => {

            // Force result just to check if is being called
            // eslint-disable-next-line
            sendgridSpy.mockReturnValue(<any>{});

            await expect(sendEmail("sendgrid", args)).rejects.toThrow();
        });

        test("Test Serverless function using sendgrid", async () => {
            // eslint-disable-next-line
            sendgridSpy.mockReturnValue(<any>result);

            const expected = await email({body: JSON.stringify({
                "provider": "mailchimp",
                "to": ["foo@bar.com"],
                "subject": "This is a test",
                "body": "Testing Sendgrid API"
            })});


            expect(expected).toEqual({statusCode: 200, body: expect.anything()});
        });

    });
});