const fs = require('fs');
const Link = require('../models/link');
const slugify = require('slugify');
const formidable = require('formidable');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

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
    return res.status(200).json({
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
    privateLinks: updateLink,
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
    privateLinks: deletedLink,
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
