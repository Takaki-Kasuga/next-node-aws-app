const express = require('express');
const router = express.Router();

// controllers
const linkController = require('../controllers/linkController');

// middleware
const { authMiddleware } = require('../middlewares/auth/authMiddleware');

const {
  decodedTokenIntoMiddleware
} = require('../middlewares/jsonWebToken/decodedTokenIntoMiddleware');

// import from middleware for validation
const {
  linkCreateValidator,
  linkUpdateValidator
} = require('../middlewares/validators/linkValidator');

const { runValidation } = require('../middlewares/validators/index');

// routes
router
  .route('/link')
  .post(
    ...decodedTokenIntoMiddleware(),
    linkCreateValidator,
    runValidation,
    authMiddleware,
    linkController.create
  );

router.route('/links').get(linkController.list);

router
  .route('/link/:slug')
  .get(linkController.read)
  .patch(
    decodedTokenIntoMiddleware,
    linkUpdateValidator,
    runValidation,
    authMiddleware,
    linkController.create
  )
  .delete(decodedTokenIntoMiddleware, authMiddleware, linkController.remove);

module.exports = router;
