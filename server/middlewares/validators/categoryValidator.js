const express = require('express');
const app = express();
const { body } = require('express-validator');

exports.categoryCreateValidator = [
  body('name', 'Name is required!').not().isEmpty(),
  body('image', 'Image is required!').not().isEmpty(),
  body('content', 'Content must be at least 20 characters long').isLength({
    min: 20
  })
];

exports.categoryUpdateValidator = [
  body('name', 'Name is required!').not().isEmpty(),
  body('content', 'Content must be at least 20 characters long').isLength({
    min: 20
  })
];
