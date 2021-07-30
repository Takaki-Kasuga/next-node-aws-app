const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
      index: true
    },
    image: {
      url: String,
      key: String
    },
    content: {
      type: {},
      minlength: 20,
      maxlength: 20000
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

const Category = mongoose.model('Category', CategorySchema);
module.exports = Category;
