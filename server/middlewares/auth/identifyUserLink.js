const Link = require('../../models/link');

exports.canUpdateDeleteLink = async (req, res, next) => {
  const { linkId } = req.params;
  console.log('linkId', linkId);
  const link = await Link.findById(linkId);
  if (!link) {
    return res.status(400).json({
      errors: [
        {
          msg: 'Coud not find link'
        }
      ],
      status: 'failed'
    });
  }
  console.log('link.postedBy.toString()', link.postedBy);
  console.log('req.user._id.toString()', req.user._id);
  let authorizations = link.postedBy.toString() === req.user._id.toString();
  console.log('authorizations', authorizations);

  if (!authorizations) {
    return res.status(400).json({
      errors: [
        {
          msg: 'You are not authorized'
        }
      ],
      status: 'failed'
    });
  }
  next();
};
