const User = require('../../models/user');

exports.adminMiddleware = async (req, res, next) => {
  console.log('adminMiddleware');
  console.log('req.user', req.user);
  const adminUserId = req.user._id;
  try {
    const user = await User.findOne({ _id: adminUserId });
    if (!user)
      return res.status(401).json({
        message:
          'You has not registerd in App yet. Please register in this application.',
        status: 'failed'
      });
    if (user.role !== 'admin') {
      return res.status(401).json({
        message: 'Admin resource. Access denied.',
        status: 'failed'
      });
    }
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
