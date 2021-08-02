const mongoose = require('mongoose');

const LinkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      maxlength: 256
    },
    url: {
      type: String,
      trim: true,
      required: true,
      maxlength: 256
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
      index: true
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
      }
    ],
    type: {
      type: String,
      default: 'Free'
    },
    medium: {
      type: String,
      default: 'Video'
    },
    clicks: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

const Link = mongoose.model('Link', LinkSchema);
module.exports = Link;
