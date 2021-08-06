const User = require('../models/user');
const Link = require('../models/link');

exports.read = async (req, res) => {
  console.log('req.uesr._id', req.user._id);

  try {
    const getUser = await User.findById(req.user._id);
    if (!getUser) {
      return res.status(400).json({
        errors: [
          {
            msg: 'User not found'
          }
        ],
        status: 'failed'
      });
    }
    console.log(' user: getUser,', getUser);
    const getLinks = await Link.find({ postedBy: getUser })
      .populate('postedBy', ['_id', 'name', 'username'])
      .populate('categories', ['name'])
      .sort({ createdAt: -1 });

    if (!getLinks) {
      return res.status(400).json({
        errors: [
          {
            msg: 'Could not find links'
          }
        ],
        status: 'failed'
      });
    }

    console.log(' links: getLinks', getLinks);
    getUser.hashed_password = undefined;
    getUser.salt = undefined;
    return res.status(200).json({
      user: getUser,
      links: getLinks
    });
  } catch (error) {
    return res.status(500).json({
      errors: [
        {
          msg: 'Server Error'
        }
      ],
      errorData: error,
      status: 'failed'
    });
  }
};
