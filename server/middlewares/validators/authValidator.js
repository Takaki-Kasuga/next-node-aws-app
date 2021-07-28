const express = require('express');
const app = express();
const { body } = require('express-validator');

exports.userRegisterValidator = [
  body('name', 'Name is required!').not().isEmpty(),
  body('email', 'Must be a valid email address!').isEmail(),
  body('password', 'Password must be at least 6 characters long').isLength({
    min: 6
  })
];

exports.userLoginValidator = [
  body('email', 'Must be a valid email address!').isEmail(),
  body('password', 'Password must be at least 6 characters long').isLength({
    min: 6
  })
];
