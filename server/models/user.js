const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      maxlength: 12,
      unique: true,
      index: true,
      lowercase: true
    },
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
      maxlength: 32,
      lowercase: true
    },
    hashed_password: {
      type: String,
      required: true
    },
    salt: String,
    role: {
      type: String,
      default: 'subscriber'
    },
    resetPasswordLink: {
      data: String,
      default: ''
    }
  },
  { timestamps: true }
);

// virtual fields
// password is frontend input property
UserSchema.virtual('password')
  .set(function (password) {
    // create temp variable _password
    this._password = password;

    // generate salt
    this.salt = this.makeSalt();

    // encrypt password
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

UserSchema.methods = {
  // @desc  compare detabase password & incomming password
  authenticate: async function (plainPassword) {
    const isMatch = await bcrypt.compare(plainPassword, this.hashed_password);
    console.log('isMatch', isMatch);
    return isMatch;
  },
  encryptPassword: async function (password) {
    if (!password) return '';
    try {
      const hashed_password = await bcrypt.hash(password, this.salt);
      console.log('hashed_password', hashed_password);
      return hashed_password;
      return;
    } catch (error) {
      return '';
    }
  },
  makeSalt: async function () {
    const salt = await bcrypt.genSalt(10);
    console.log('salt', salt);
    return salt;
  }
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
