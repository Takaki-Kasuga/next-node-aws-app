const express = require('express');
const router = express.Router();

// controllers
const categoryController = require('../controllers/categoryController');

// middleware
const { adminMiddleware } = require('../middlewares/auth/adminMiddleware');

const {
  decodedTokenIntoMiddleware
} = require('../middlewares/jsonWebToken/decodedTokenIntoMiddleware');

// import from middleware for validation
const {
  categoryCreateValidator,
  categoryUpdateValidator
} = require('../middlewares/validators/categoryValidator');

const { runValidation } = require('../middlewares/validators/index');

// routes
router.route('/category').post(
  ...decodedTokenIntoMiddleware(),
  // categoryCreateValidator,
  // runValidation,
  adminMiddleware,
  categoryController.create
);

router.route('/categories').get(categoryController.list);

router
  .route('/category/:slug')
  .post(categoryController.read)
  .patch(
    decodedTokenIntoMiddleware,
    categoryUpdateValidator,
    runValidation,
    adminMiddleware,
    categoryController.create
  )
  .delete(
    decodedTokenIntoMiddleware,
    adminMiddleware,
    categoryController.remove
  );

module.exports = router;
