const express = require('express');
const router = express.Router();

// import from contollers
const authController = require('../controllers/authController');

// import from middleware for validation
const {
  userRegisterValidator
} = require('../middlewares/validators/authValidator');
const { runValidation } = require('../middlewares/validators/index');

// @Method  POST
// @Desc
// @Role

router
  .route('/register')
  .post(userRegisterValidator, runValidation, authController.register);

module.exports = router;
