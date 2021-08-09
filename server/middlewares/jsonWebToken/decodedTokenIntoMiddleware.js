const expressJwt = require('express-jwt');

// https://github.com/auth0/express-jwt#readme
// exports.decodedTokenIntoMiddleware = expressJwt({
//   secret: process.env.JWT_SECRET,
//   algorithms: ['HS256']
// });

exports.decodedTokenIntoMiddleware = () => {
  console.log('decodedTokenIntoMiddleware');
  return [
    expressJwt({
      secret: process.env.JWT_SECRET,
      algorithms: ['sha1', 'RS256', 'HS256']
    }),
    function (err, req, res, next) {
      if (err.name === 'UnauthorizedError') {
        console.log('UnauthorizedError');
        return res
          .status(401)
          .json({ message: 'invalid token...', status: 'failed' });
      }
      next();
    }
  ];
};
