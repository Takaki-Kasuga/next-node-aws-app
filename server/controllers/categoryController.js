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
  let form = new formidable.IncomingForm();
  form.parse(req, (error, fields, files) => {
    if (error) {
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
    // console.log('fs.readFileSync(image.path)', fs.readFileSync(image.path));
    // console.log('image.path', image.path);
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
        return res.status(200).json(saveCategory);
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
    });
  });
};

// exports.create = async (req, res) => {
//   console.log('req.user', req.user);
//   const { name, content } = req.body;
//   const slug = slugify(name);
//   const image = {
//     url: `https://via.placeholder.com/200x150.png?text=${process.env.CLIENT_URL}`,
//     key: '123'
//   };

//   const category = new Category({
//     name,
//     slug,
//     image
//   });
//   category.postedBy = req.user._id;

//   try {
//     const categoryData = await category.save();
//     console.log('categoryData', categoryData);
//     res.status(200).json(categoryData);
//   } catch (error) {
//     return res.status(500).json({
//       errors: [
//         {
//           msg: 'Server error.'
//         }
//       ],
//       errorData: error,
//       status: 'failed'
//     });
//   }
// };
exports.list = async (req, res) => {};
exports.read = async (req, res) => {};
exports.remove = async (req, res) => {};
