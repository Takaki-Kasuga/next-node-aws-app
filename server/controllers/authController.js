const User = require('../models/user');
const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');

// @document  https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/ses-examples-sending-email.html
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

// @Method     POST
// @API ROUTE  /api/auth/register
// @Desc       Register new User & send Email
exports.register = (req, res) => {
  console.log('register req.body', req.body);
  const { name, email, password } = req.body;

  // check if user exists or not
  User.findOne({ email }).exec(function (err, user) {
    console.log('exec/error', err);
    console.log('exec/user', user);

    if (user) return res.status(400).json({ error: 'Email is taken' });

    // generate token with user email and _password
    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      {
        expiresIn: '10m'
      }
    );

    // Send email
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
            Data: `<html>
                    <h1>Verify your email address</h1>
                    <p>Please use the following link complete your registration</p>
                    <p>${process.env.CLIENT_URL}/auth/activate/${token}}</p>
                  </html>`
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
  });
};
