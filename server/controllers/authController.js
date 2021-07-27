const User = require('../models/user');
const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');

// helpers
const { registerEnailParams } = require('../helpers/email');

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
exports.register = async (req, res) => {
  console.log('register req.body', req.body);
  const { name, email, password } = req.body;

  // check if user exists or not
  try {
    const user = await User.findOne({ email });
    // user have been registerd
    console.log('user', user);
    if (user)
      return res
        .status(400)
        .json({ message: 'Email is taken', status: 'failed' });

    // generate token with user email and _password
    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      {
        expiresIn: '10m'
      }
    );

    // Send email
    const params = registerEnailParams(email, token);

    const sendEmailOnRegister = ses.sendEmail(params).promise();

    sendEmailOnRegister
      .then((data) => {
        console.log('Email submitted to SES', data);
        res.status(200).json({
          message: `Email has been sent to ${email}, Follow the instruction to complete your registration`,
          status: 'success'
        });
      })
      .catch((error) => {
        console.log('SES email on register', error);
        res.status(401).json({
          errors: error,
          message: 'We could not verify your email, please try again.',
          status: 'failed'
        });
      });
  } catch (error) {
    res.status(500).json({
      errors: error,
      message: 'Server error at finding user infomation.',
      status: 'failed'
    });
  }
};

// User.findOne({ email }).exec(function (err, user) {
//   console.log('exec/error', err);
//   console.log('exec/user', user);

//   // user have been registerd
//   if (user)
//     return res
//       .status(400)
//       .json({ message: 'Email is taken', status: 'failed' });

//   // generate token with user email and _password
//   const token = jwt.sign(
//     { name, email, password },
//     process.env.JWT_ACCOUNT_ACTIVATION,
//     {
//       expiresIn: '10m'
//     }
//   );

//   // Send email
//   const params = registerEnailParams(email, token);

//   const sendEmailOnRegister = ses.sendEmail(params).promise();
//   sendEmailOnRegister
//     .then((data) => {
//       console.log('Email submitted to SES', data);
//       res.status(200).json({
//         message: `Email has been sent to ${email}, Follow the instruction to complete your registration`,
//         status: 'success'
//       });
//     })
//     .catch((error) => {
//       console.log('SES email on register', error);
//       res.status(401).json({
//         errors: error,
//         message: `Email has been sent to ${email}, Follow the instruction to complete your registration`,
//         status: 'failed'
//       });
//     });
// });
