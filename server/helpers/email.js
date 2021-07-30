exports.registerEnailParams = (email, token) => {
  return {
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
                    <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
                  </html>`
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Complete your registration'
      }
    }
  };
};

exports.forgotPasswordEnailParams = (email, token) => {
  return {
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
                    <h1>Reset Password Link</h1>
                    <p>Please use the following link to reset password:</p>
                    <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
                  </html>`
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Password reset link'
      }
    }
  };
};
