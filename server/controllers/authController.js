const AWS = require('aws-sdk');

// @document  https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/ses-examples-sending-email.html
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

// @Method  POST
// @Desc
// @Role
exports.register = (req, res) => {
  console.log('register req.body', req.body);
  const { name, email, password } = req.body;
  const params = {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: [email]
    },
    ReplyToAddresses: [
      process.env.EMAIL_TO
      /* more items */
    ],
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: 'UTF-8',
          Data: `<html><body><h1>Hello ${name}</h1><p>Test Email</p></body></html>`
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Complete your registration'
      }
    }
  };
  const sendEmailOnRegister = ses.sendEmail(params).promise();
  sendEmailOnRegister
    .then((data) => {
      console.log('Email submitted to SES', data);
      res.send('Email sent');
    })
    .catch((error) => {
      console.log('SES email on register', error);
      res.send('Email failed');
    });
};
