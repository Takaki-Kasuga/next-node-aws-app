const express = require('express');
const router = express.Router();

// import from contollers
const authController = require('../controllers/authController');

// @Method
// @Desc
// @Role

router.route('/register').get(authController.register);

module.exports = router;
