const User = require('../models/user');
const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { nanoid } = require('nanoid');
const _ = require('lodash');

// helpers
const {
  registerEnailParams,
  forgotPasswordEnailParams
} = require('../helpers/email');

// @document  https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/ses-examples-sending-email.html
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

// @Method     POST
// @API ROUTE  /api/auth/register
// @Desc       Register new User & send Email
exports.register = async (req, res) => {
  const { name, email, password, categories } = req.body;

  // check if user exists or not
  try {
    const user = await User.findOne({ email });
    // user have been registerd
    if (user)
      return res
        .status(401)
        .json({ message: 'Email is taken', status: 'failed' });

    // generate token with user email and _password
    const token = jwt.sign(
      { name, email, password, categories },
      process.env.JWT_SECRET,
      {
        expiresIn: '10m'
      }
    );

    // Send email
    const params = registerEnailParams(email, token);

    const sendEmailOnRegister = ses.sendEmail(params).promise();

    sendEmailOnRegister
      .then((data) => {
        console.log('Email submitted to SES', data);
        res.status(200).json({
          message: `Email has been sent to ${email}, Follow the instruction to complete your registration`,
          status: 'success'
        });
      })
      .catch((error) => {
        console.log('SES email on register', error);
        res.status(401).json({
          errors: error,
          message: 'We could not verify your email, please try again.',
          status: 'failed'
        });
      });
  } catch (error) {
    res.status(500).json({
      errors: error,
      message: 'Server error at finding user infomation.',
      status: 'failed'
    });
  }
};

// @Method     POST
// @API ROUTE  /api/auth/register/activate
// @Desc       Register activate for user and cerate new user save mongoDB
exports.registerActivate = async (req, res) => {
  const { token } = req.body;
  console.log('token', token);
  try {
    const { name, email, password, categories } = jwt.decode(token);
    console.log('jwt.decode(token);', jwt.decode(token));

    // create unique 12 character
    const username = nanoid(12);

    const user = await User.findOne({ email });
    console.log('user', user);
    if (user)
      return res
        .status(401)
        .json({ message: 'Email is taken', status: 'failed' });

    // create salt for bycrypt
    const salt = await bcrypt.genSalt(10);
    // create hash password
    const hashed_password = await bcrypt.hash(password, salt);

    // create new user
    const dbUser = new User({
      username,
      name,
      email,
      hashed_password,
      salt,
      categories
    });

    console.log('dbUser', dbUser);

    const saveUser = await dbUser.save();
    console.log('saveUser', saveUser);
    res
      .status(200)
      .json({ message: 'Registration success', status: 'success' });
  } catch (error) {
    res.status(500).json({
      errors: error,
      message: 'Server error.',
      status: 'failed'
    });
  }
};

// @Method     POST
// @API ROUTE  /api/auth/login
// @Desc       Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  console.log('ここまできているよ');
  try {
    const user = await User.findOne({ email: email });
    console.log('DBから一致するオブジェクトを見つけたお。');
    if (!user)
      return res.status(401).json({
        message:
          'You has not registerd in App yet. Please register in this application.',
        status: 'failed'
      });
    console.log('user', user);
    const isMatch = await bcrypt.compare(password, user.hashed_password);
    if (!isMatch)
      return res.status(500).json({
        message:
          'Password is not your password you have been registered. Please try again.',
        status: 'failed'
      });

    // generate token with mongo ObjectId（this is access token）
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({
      message: 'You succeeded in logining this application.',
      status: 'success',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      errors: error,
      message: 'Server error.',
      status: 'failed'
    });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email: email });
    console.log('DBから一致するオブジェクトを見つけたお。');
    if (!user)
      return res.status(401).json({
        message: 'User with that email does not exist',
        status: 'failed'
      });

    const token = jwt.sign({ name: user.name }, process.env.JWT_SECRET, {
      expiresIn: '10m'
    });

    // Send email
    const params = forgotPasswordEnailParams(email, token);

    const resetPasswordUser = await User.updateOne(
      { email },
      { $set: { resetPasswordLink: token } }
    );
    if (!resetPasswordUser)
      return res.status(401).json({
        message: 'Password reset failed. Please try again.',
        status: 'failed'
      });

    const sendEmailOnResetPassword = ses.sendEmail(params).promise();

    sendEmailOnResetPassword
      .then((data) => {
        console.log('SES reset password success', data);
        res.status(200).json({
          message: `Email has been sent to ${email}, Click on the link to reset password.`,
          status: 'success'
        });
      })
      .catch((error) => {
        console.log('SES reset password failed', error);
        res.status(401).json({
          errors: error,
          message: 'We could not verify your email, please try again.',
          status: 'failed'
        });
      });
  } catch (error) {
    res.status(500).json({
      errors: error,
      message: 'Server error.',
      status: 'failed'
    });
  }
};
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    if (token) {
      // chexk for expirey（middleware on）
      // try {
      //   jwt.verify(token, process.env.JWT_SECRET);
      // } catch (error) {
      //   return res.status(401).json({
      //     errors: error,
      //     message: 'Expired link Try again.',
      //     status: 'failed'
      //   });
      // }

      const user = await User.findOne({ resetPasswordLink: token });
      if (!user) {
        return res.status(401).json({
          message: 'Invalid token. Please try again.',
          status: 'failed'
        });
      }

      // create salt for bycrypt
      const salt = await bcrypt.genSalt(10);
      // create hash password
      const hashed_password = await bcrypt.hash(newPassword, salt);

      // another pattern request type Put
      // console.log('user', user);
      // const updateFields = {
      //   hashed_password,
      //   resetPasswordLink: ''
      // };
      // const updateUserModelData = _.extend(user, updateFields);
      // console.log('updateUserModelData', updateUserModelData);
      // await updateUserModelData.save();

      // request type Patch
      await User.updateOne(
        { resetPasswordLink: token },
        { $set: { hashed_password, resetPasswordLink: '' } }
      );

      return res.status(200).json({
        message: 'Great! Now you can login with your new Password!',
        status: 'success'
      });
    }
  } catch (error) {
    return res.status(500).json({
      errors: error,
      message: 'Server error.',
      status: 'failed'
    });
  }
};
