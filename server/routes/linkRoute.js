const express = require('express');
const router = express.Router();

// controllers
const linkController = require('../controllers/linkController');

// middleware
const { authMiddleware } = require('../middlewares/auth/authMiddleware');
const { adminMiddleware } = require('../middlewares/auth/adminMiddleware');
const { canUpdateDeleteLink } = require('../middlewares/auth/identifyUserLink');

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

router.route('/links/popular').get(linkController.popular);
router.route('/links/popular/:category').get(linkController.popularInCategory);

router
  .route('/links')
  .post(...decodedTokenIntoMiddleware(), adminMiddleware, linkController.list);
router.route('/click-count').put(linkController.clickCount);

router
  .route('/link/:linkId')
  .get(linkController.read)
  .put(
    ...decodedTokenIntoMiddleware(),
    linkUpdateValidator,
    runValidation,
    authMiddleware,
    canUpdateDeleteLink,
    linkController.update
  )
  .delete(
    ...decodedTokenIntoMiddleware(),
    authMiddleware,
    canUpdateDeleteLink,
    linkController.remove
  );

router
  .route('/link/admin/:linkId')
  .put(
    ...decodedTokenIntoMiddleware(),
    linkUpdateValidator,
    runValidation,
    adminMiddleware,
    linkController.update
  )
  .delete(
    ...decodedTokenIntoMiddleware(),
    adminMiddleware,
    linkController.remove
  );

module.exports = router;
