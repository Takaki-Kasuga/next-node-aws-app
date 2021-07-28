const jwt = require('jsonwebtoken');

exports.confirmVerifyJsonWebToken = (req, res, next) => {
  const { token } = req.body;

  if (!token)
    return res.status(401).json({
      message: 'We can not confirm your token. Please try again.',
      status: 'failed'
    });

  try {
    // verify token
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION);
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({
      errors: error,
      message: 'Expired link Try again.',
      status: 'failed'
    });
  }
};
