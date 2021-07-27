const express = require('express');
const router = express.Router();

// import from contollers
const authController = require('../controllers/authController');

// @Method  POST
// @Desc
// @Role

router.route('/register').post(authController.register);

module.exports = router;
