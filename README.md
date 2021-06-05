# Send Email Rest API
Backend created using Serverless/Typescript to send email using Mailchimp ([Mandrillapp](https://mandrillapp.com/)) and [Sendgrid](https://sendgrid.com/).

I have decided to build the backend in Serverless because of the cheap cost and the quick deployment to AWS Lambda

---

## Challenges

One of the challenges to develop this API was the integration with Mandrillapp. The only way to get their API to work is by authenticating a domain to their account. Luckily I have my personal domain, which I have connected to Google Gsuite to be able to receive the Mandrillapp verification email. In addition to that, because I used a Free account, I can only test emails from and to my own domain.

Sidegrid, on the other hand, was more streamline. The connection with their API was easy and the documentation was simple and straightforward.

---

## Environment File

API keys and other constants need to be set into a `.env` file. All necessary constants for this project can be found on the file `.env.SAMPLE`. Copy `.env.SAMPLE` to create the `.env` file

```
MAILCHIMP_API_KEY="MAILCHIMP API KEY"
MC_FROM_EMAIL="SENDGRIP API KEY"
SENDGRID_API_KEY="MAILCHIMP Email From"
SG_FROM_EMAIL="SENDGRID Email From"
```

`From email` of Mailchimp and Sendgrip are different because Mailchimp email has to be from the authenticated domain (when using free account)

---

## Run Locally

To run this project locally, first it is needed to have serverless installed

```
npm install -g serverless
```

After serverless is install. Install modules of the project and start

```
npm install
npm start
```

---

## Deploy

To deploy the API, run

```
serverless deploy
```


## TODO

- Integrate AWS SES
- Create CORS rules once the frontend is done