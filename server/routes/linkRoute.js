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
router.route('/click-count').put(linkController.clickCount);

router
  .route('/link/:linkId')
  .get(linkController.read)
  .put(
    ...decodedTokenIntoMiddleware(),
    linkUpdateValidator,
    runValidation,
    authMiddleware,
    linkController.update
  )
  .delete(
    ...decodedTokenIntoMiddleware(),
    authMiddleware,
    linkController.remove
  );

module.exports = router;
