const fs = require('fs');
const Link = require('../models/link');
const User = require('../models/user');
const Category = require('../models/category');
const slugify = require('slugify');
const formidable = require('formidable');
const AWS = require('aws-sdk');
const { linkPublishedParams } = require('../helpers/email');

// @document  https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/ses-examples-sending-email.html
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});
const ses = new AWS.SES({ apiVersion: '2010-12-01' });

exports.create = async (req, res) => {
  const { title, url, categories, type, medium } = req.body;
  console.table({ title, url, categories, type, medium });
  const slug = slugify(url);
  console.log('slug', slug);
  let link = new Link({
    title,
    url,
    type,
    medium,
    slug,
    categories
  });

  link.postedBy = req.user._id;

  try {
    const saveLink = await link.save();
    if (!saveLink) {
      return res.status(500).json({
        errors: [
          {
            msg: 'Error saving link database'
          }
        ],
        status: 'failed'
      });
    }

    const findUsers = await User.find({ categories: { $in: categories } });
    console.log('findUsers', findUsers);
    if (!findUsers) {
      return res.status(400).json({
        errors: [
          {
            msg: 'Error finding users to send email to on link piblish'
          }
        ],
        status: 'failed'
      });
    }
    const findCategories = await Category.find({ _id: { $in: categories } });
    if (!categories) {
      return res.status(400).json({
        errors: [
          {
            msg: 'Error finding categories to send email to on link piblish'
          }
        ],
        status: 'failed'
      });
    }
    console.log('findCategories', findCategories);
    saveLink.categories = findCategories;
    console.log('saveLink.categories', saveLink.categories);
    for (let i = 0; i < findUsers.length; i++) {
      const params = linkPublishedParams(findUsers[i].email, saveLink);
      const sendEmail = ses.sendEmail(params).promise();

      sendEmail
        .then((success) => {
          console.log('email submitted to SES ', success);
          return;
        })
        .catch((failure) => {
          console.log('error on email submitted to SES  ', failure);
          return;
        });
    }
    res.status(200).json({
      link: saveLink,
      status: 'success',
      message: 'you succeeded in creating a link'
    });
  } catch (error) {
    return res.status(500).json({
      errors: [
        {
          msg: ' Server Error'
        }
      ],
      errorData: error,
      status: 'failed'
    });
  }
};

exports.list = async (req, res) => {
  let limitFields = req.body.limit ? parseInt(req.body.limit) : 10;
  let skipFields = req.body.skip ? parseInt(req.body.skip) : 0;

  try {
    const allLinkLists = await Link.find()
      .populate('postedBy', ['_id', 'name', 'username'])
      .populate('categories', ['name', 'slug'])
      .sort({ createdAt: -1 })
      .skip(skipFields)
      .limit(limitFields);

    if (!allLinkLists) {
      return res.status(400).json({
        errors: [
          {
            msg: 'Could not list links'
          }
        ],
        status: 'failed'
      });
    }
    res.status(200).json({
      links: allLinkLists,
      status: 'success',
      message: 'you succeeded in getting all link lists'
    });
  } catch (error) {
    return res.status(500).json({
      errors: [
        {
          msg: ' Server Error'
        }
      ],
      errorData: error,
      status: 'failed'
    });
  }
};

exports.read = async (req, res) => {
  const { linkId } = req.params;
  console.log('linkId,', linkId);
  const getLink = await Link.findById(linkId)
    .populate('postedBy', ['_id', 'name', 'username'])
    .populate('categories', ['name', 'slug']);
  if (!getLink) {
    return res.status(400).json({
      errors: [
        {
          msg: 'Error finding the link'
        }
      ],
      status: 'failed'
    });
  }
  console.log('getLink', getLink);
  res.status(200).json({
    link: getLink,
    status: 'success',
    message: 'you succeeded in deleting the link'
  });
};
exports.update = async (req, res) => {
  const { linkId } = req.params;
  const { title, url, categories, type, medium } = req.body;
  const updateLink = await Link.findByIdAndUpdate(
    linkId,
    {
      title,
      url,
      categories,
      type,
      medium
    },
    { new: true }
  );
  if (!updateLink) {
    return res.status(400).json({
      errors: [
        {
          msg: 'Error updating the link'
        }
      ],
      status: 'failed'
    });
  }
  res.status(200).json({
    link: updateLink,
    status: 'success',
    message: 'you succeeded in updating the link'
  });
};

exports.remove = async (req, res) => {
  const { linkId } = req.params;
  const deletedLink = await Link.findByIdAndRemove(linkId);
  if (!deletedLink) {
    return res.status(400).json({
      errors: [
        {
          msg: 'Error removing the link'
        }
      ],
      status: 'failed'
    });
  }
  console.log('deletedLink', deletedLink);
  res.status(200).json({
    link: deletedLink,
    status: 'success',
    message: 'you succeeded in deleting the link'
  });
};

exports.clickCount = async (req, res) => {
  const { linkId } = req.body;
  try {
    const updateLinkClicks = await Link.findByIdAndUpdate(
      linkId,
      {
        $inc: { clicks: 1 }
      },
      { new: true }
    )
      .populate('postedBy', ['_id', 'name', 'username'])
      .populate('categories', ['name']);
    if (!updateLinkClicks) {
      return res.status(400).json({
        errors: [
          {
            msg: 'Could not view counts'
          }
        ],
        status: 'failed'
      });
    }
    return res.status(200).json({
      links: updateLinkClicks,
      status: 'success',
      message: 'you succeeded in incrementing click number'
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

exports.popular = async (req, res) => {
  try {
    const getPopularLinks = await Link.find()
      .populate('postedBy', ['_id', 'name', 'username'])
      .populate('categories', ['name'])
      .sort({ clicks: -1 })
      .limit(3);

    console.log('getPopularLinks', getPopularLinks);
    if (!getPopularLinks) {
      return res.status(400).json({
        errors: [
          {
            msg: 'Links not founded'
          }
        ],
        status: 'failed'
      });
    }
    res.status(200).json({
      links: getPopularLinks,
      status: 'success',
      message: 'you succeeded in getting popular links'
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

exports.popularInCategory = async (req, res) => {
  const { category } = req.params;
  console.log('category', category);

  try {
    const getPopularCategory = await Category.findOne({ slug: category });
    console.log('getPopularCategory', getPopularCategory);
    if (!getPopularCategory) {
      return res.status(400).json({
        errors: [
          {
            msg: 'Coud not load categories'
          }
        ],
        status: 'failed'
      });
    }
    const getPopularLinks = await Link.find({ categories: getPopularCategory })
      .populate('postedBy', ['_id', 'name', 'username'])
      .populate('categories', ['name'])
      .sort({ clicks: -1 })
      .limit(3);
    if (!getPopularLinks) {
      return res.status(400).json({
        errors: [
          {
            msg: 'Links not founded'
          }
        ],
        status: 'failed'
      });
    }
    res.status(200).json({
      links: getPopularLinks,
      status: 'success',
      message: 'you succeeded in getting popular links'
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
