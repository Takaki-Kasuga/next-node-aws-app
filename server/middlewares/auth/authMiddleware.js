const User = require('../../models/user');

exports.authMiddleware = async (req, res, next) => {
  const authUserId = req.user._id;
  try {
    const user = await User.findOne({ _id: authUserId });
    if (!user)
      return res.status(401).json({
        message:
          'You has not registerd in App yet. Please register in this application.',
        status: 'failed'
      });
    req.profile = user;
  } catch (error) {
    return res.status(500).json({
      errors: error,
      message: 'Server error.',
      status: 'failed'
    });
  }

  next();
};
