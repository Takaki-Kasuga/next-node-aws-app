const fs = require('fs');
const Link = require('../models/link');
const slugify = require('slugify');
const formidable = require('formidable');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

exports.create = async (req, res) => {
  const { title, url, categories, type, medium } = req.body;
  console.table({ title, url, categories, type, medium });
  const slug = url;
  let link = new Link({
    title,
    url,
    type,
    medium,
    slug
  });

  let arrayOfCategories = categories && categories.split(',');
  link.postedBy = req.user._id;
  link.categories = arrayOfCategories;

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
      saveLink,
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
  try {
    const allLinkLists = await Link.find();
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
      allLinkLists,
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
exports.read = async (req, res) => {};
exports.update = async (req, res) => {};
exports.remove = async (req, res) => {};
