const fs = require('fs');
const Category = require('../models/category');
const slugify = require('slugify');
const formidable = require('formidable');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

// s3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

exports.create = async (req, res) => {
  console.log('ここまできてるよ＝');
  console.log('req.body', req.body);
  let form = new formidable.IncomingForm();
  console.log('ここまできてるよ＝');
  form.parse(req, (error, fields, files) => {
    if (error) {
      console.log('エラー発生なう');
      return res.status(400).json({
        errors: [
          {
            msg: 'Image could not upload'
          }
        ],
        errorData: error,
        status: 'failed'
      });
    }
    console.table({ error });
    console.table({ fields });
    console.table({ files });
    const { name, content } = fields;
    const { image } = files;
    console.log('image.size', image.path);
    const slug = slugify(name);
    let category = new Category({
      name,
      content,
      slug
    });
    if (image.size > 2000000) {
      return res.status(400).json({
        errors: [
          {
            msg: 'Image shoud be less than 2mb'
          }
        ],
        status: 'failed'
      });
    }

    // upload image to s3
    const params = {
      Bucket: 'hacker-stack-contents',
      Key: `category/${uuidv4()}`,
      Body: fs.readFileSync(image.path),
      ACL: 'public-read',
      ContentType: 'image/jpg'
    };

    s3.upload(params, async function (error, data) {
      if (error) {
        return res.status(400).json({
          errors: [
            {
              msg: 'Upload to s3 failed'
            }
          ],
          errorData: error,
          status: 'failed'
        });
      }
      console.log('AWS UPLOAD RES DATA', data);
      category.image.url = data.Location;
      category.image.key = data.Key;
      // save to db
      try {
        console.log('ここまできています。', category);
        const saveCategory = await category.save();
        console.log('saveCategory', saveCategory);
        if (!saveCategory) {
          return res.status(400).json({
            errors: [
              {
                msg: 'Error saving category database'
              }
            ],
            errorData: error,
            status: 'failed'
          });
        }
        return res.status(200).json({
          saveCategory,
          status: 'success',
          message: 'you succeeded in uploading image'
        });
      } catch (error) {
        return res.status(500).json({
          errors: [
            {
              msg: 'You cannnot save same name. Please try again.'
            }
          ],
          errorData: error,
          status: 'failed'
        });
      }
    });
  });
};

exports.list = async (req, res) => {
  try {
    const allCategoryLists = await Category.find();
    if (!allCategoryLists) {
      return res.status(400).json({
        errors: [
          {
            msg: 'Category could not load'
          }
        ],
        status: 'failed'
      });
    }
    res.status(200).json({
      allCategoryLists,
      status: 'success',
      message: 'you succeeded in getting all category lists'
    });
  } catch (error) {
    return res.status(400).json({
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
exports.remove = async (req, res) => {};
