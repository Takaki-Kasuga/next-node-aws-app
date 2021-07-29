const expressJwt = require('express-jwt');

// https://github.com/auth0/express-jwt#readme
exports.decodedTokenIntoMiddleware = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256']
});
