const express = require('express');
const router = express.Router();

// import from contollers
const authController = require('../controllers/authController');

// import from middleware for validation
const {
  userRegisterValidator,
  userLoginValidator
} = require('../middlewares/validators/authValidator');
const {
  confirmVerifyJsonWebToken
} = require('../middlewares/jsonWebToken/confirmVerifyToken');
const { runValidation } = require('../middlewares/validators/index');

// @Method  POST
// @Desc
// @Role

router
  .route('/register')
  .post(userRegisterValidator, runValidation, authController.register);

router
  .route('/register/activate')
  .post(confirmVerifyJsonWebToken, authController.registerActivate);

router
  .route('/login')
  .post(userLoginValidator, runValidation, authController.login);

module.exports = router;
