import { email, sendEmail } from ".";
import env from "../../constants";

// Mock of variables
jest.mock("../../constants", () => ({
    MAILCHIMP_API_KEY: "foo",
    MC_FROM_EMAIL: "bar"
}));

// Mock mailchimp function
const mailchimpSpy = jest.fn();
jest.mock("@mailchimp/mailchimp_transactional", () => jest.fn().mockImplementation((key: string) => ({
    messages: {
        send: mailchimpSpy
    }   
})));


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
    });

    describe("Test main serverless function", () => {
        test.only("Test using sendgrid", async () => {
            const expected = await email({body: JSON.stringify({
                "provider": "sendgrid",
                "to": ["foo@bar.com"],
                "subject": "This is a test",
                "body": "Testing Sendgrid API"
            })});

            console.log(expected)
        });
    });
});