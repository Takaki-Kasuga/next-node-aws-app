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

exports.linkPublishedParams = (email, data) => {
  console.log('data.categories.image', data.categories.image);
  console.log('data', data);
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
                    <h1>New link published | from app</h1>
                    <p>A new Link Title <b>${
                      data.title
                    }</b>has been just published!</p>
                   ${data.categories
                     .map((category) => {
                       return `
                     <div>
                       <h2>${category.name}</h2>
                       <img src="${category.image.url}" alt="${category.name}" style="height:50px;" />
                       <h3>
                         <a href="${process.env.CLIENT_URL}/links/${category.slug}">Check it now!!</a>
                       </h3>
                     </div>
                     `;
                     })
                     .join(
                       '--------------------------------------------------------'
                     )}

                     <p>Do not with to receive notification?</p>
                     <p>Turn off notification by going to your <b>dashboard</b> > <b>update profile</b> and uncheck the categories.</p>
                      <p>${process.env.CLIENT_URL}/user/profile/update</p>
                  </html>`
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'New link published'
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
