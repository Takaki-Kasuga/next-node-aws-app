const express = require('express');
const router = express.Router();

// import from contollers
const userController = require('../controllers/userController');

// import middlewares
const {
  decodedTokenIntoMiddleware
} = require('../middlewares/jsonWebToken/decodedTokenIntoMiddleware');
const { adminMiddleware } = require('../middlewares/auth/adminMiddleware');
const { authMiddleware } = require('../middlewares/auth/authMiddleware');

// import validator
const {
  userUpdateValidator
} = require('../middlewares/validators/authValidator.js');
const { runValidation } = require('../middlewares/validators/index');

router
  .route('/user')
  .get(...decodedTokenIntoMiddleware(), authMiddleware, userController.read);

router
  .route('/admin')
  .get(...decodedTokenIntoMiddleware(), adminMiddleware, userController.read);

router
  .route('/user')
  .put(
    ...decodedTokenIntoMiddleware(),
    userUpdateValidator,
    runValidation,
    adminMiddleware,
    userController.update
  );

module.exports = router;
