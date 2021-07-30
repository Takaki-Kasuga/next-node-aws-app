const Category = require('../models/category');
const slugify = require('slugify');

exports.create = async (req, res) => {
  console.log('req.user', req.user);
  const { name, content } = req.body;
  const slug = slugify(name);
  const image = {
    url: `https://via.placeholder.com/200x150.png?text=${process.env.CLIENT_URL}`,
    key: '123'
  };

  const category = new Category({
    name,
    slug,
    image
  });
  category.postedBy = req.user._id;

  try {
    const categoryData = await category.save();
    console.log('categoryData', categoryData);
    res.status(200).json(categoryData);
  } catch (error) {
    return res.status(500).json({
      errors: [
        {
          msg: 'Server error.'
        }
      ],
      errorData: error,
      status: 'failed'
    });
  }
};
exports.list = async (req, res) => {};
exports.read = async (req, res) => {};
exports.remove = async (req, res) => {};
