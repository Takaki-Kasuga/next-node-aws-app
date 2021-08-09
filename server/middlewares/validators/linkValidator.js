const express = require('express');
const app = express();
const { body } = require('express-validator');

exports.linkCreateValidator = [
  body('title', 'Title is required!').not().isEmpty(),
  body('url', 'URL is required!').not().isEmpty(),
  body('categories', 'Pick a category').not().isEmpty(),
  body('type', 'Pick a type free or paid').not().isEmpty(),
  body('medium', 'Pick a medium video or book').not().isEmpty()
];

exports.linkUpdateValidator = [
  body('title', 'Title is required!').not().isEmpty(),
  body('url', 'URL is required!').not().isEmpty(),
  body('categories', 'Pick a category').not().isEmpty(),
  body('type', 'Pick a type free or paid').not().isEmpty(),
  body('medium', 'Pick a medium video or book').not().isEmpty()
];
