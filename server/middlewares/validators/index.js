const { validationResult } = require('express-validator');

exports.runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array(),
      message: 'Validation error! please try again.',
      status: 'failed'
    });
  }
  next();
};
