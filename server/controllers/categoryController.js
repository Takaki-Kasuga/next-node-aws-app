const fs = require('fs');
const Category = require('../models/category');
const Link = require('../models/link');
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

    console.log('files.image.type', files.image.type);
    const extensionType = files.image.type.replace('image/', '');
    // upload image to s3
    const params = {
      Bucket: 'hacker-stack-contents',
      Key: `category/${uuidv4()}.${extensionType}`,
      Body: fs.readFileSync(image.path),
      ACL: 'public-read',
      ContentType: files.image.type
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

      // posted by
      category.postedBy = req.user._id;

      try {
        // save to db
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
          category: saveCategory,
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
            msg: 'Category could not be loaded'
          }
        ],
        status: 'failed'
      });
    }
    res.status(200).json({
      categories: allCategoryLists,
      status: 'success',
      message: 'you succeeded in getting all category lists'
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
  const { slug } = req.params;
  let limitFields = req.body.limit ? parseInt(req.body.limit) : 10;
  let skipFields = req.body.skip ? parseInt(req.body.skip) : 0;
  console.log(
    'limitFields',
    limitFields,
    'skipFields',
    skipFields,
    'slug',
    slug
  );
  try {
    const getCategory = await Category.findOne({ slug }).populate('postedBy', [
      '_id',
      'name',
      'username'
    ]);
    console.log('getCategory', getCategory);
    if (!getCategory) {
      return res.status(400).json({
        errors: [
          {
            msg: 'Category could not be loaded'
          }
        ],
        status: 'failed'
      });
    }

    const allLinkLists = await Link.find({ categories: getCategory })
      .populate('postedBy', ['_id', 'name', 'username'])
      .populate('categories', ['name'])
      .sort({ createdAt: -1 })
      .limit(limitFields)
      .skip(skipFields);
    console.log('allLinkLists', allLinkLists);

    if (!allLinkLists) {
      return res.status(400).json({
        errors: [
          {
            msg: 'Links of category could not be loaded'
          }
        ],
        status: 'failed'
      });
    }

    res.status(200).json({
      category: getCategory,
      links: allLinkLists,
      status: 'success',
      message: 'you succeeded in getting the category'
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

exports.update = async (req, res) => {
  const { slug } = req.params;
  const { name, image, content } = req.params;

  const updateCategoy = await Category.findOneAndUpdate(
    { slug },
    { name, content },
    { new: true }
  );

  if (!updateCategoy) {
    return res.status(400).json({
      errors: [
        {
          msg: 'Could not find category to update by slug'
        }
      ],
      status: 'failed'
    });
  }

  console.log('updateCategoy', updateCategoy);
  if (image) {
    // remove the existing image from s3 backets before uploading new/updared one
    const deleteParams = {
      Bucket: 'hacker-stack-contents',
      Key: updateCategoy.image.key
    };
    try {
      s3.deleteObject(deleteParams, (error, data) => {
        if (error) {
          return res.status(400).json({
            errors: [
              {
                msg: `Error in deleting to s3 file this category/${updateCategoy.image.key}`
              }
            ],
            errorData: error,
            status: 'failed'
          });
        } else {
          console.log('this image deleted', data);
        }
      });

      // handle upload image s3
      const params = {
        Bucket: 'hacker-stack-contents',
        Key: `${uuidv4()}`,
        Body: fs.readFileSync(image.path),
        ACL: 'public-read',
        ContentType: files.image.type
      };

      s3.upload(params, async function (error, data) {
        if (error) {
          return res.status(500).json({
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
        updateCategoy.image.url = data.Location;
        updateCategoy.image.key = data.Key;

        try {
          // save to db
          console.log('updateCategoy', updateCategoy);
          const saveCategory = await updateCategoy.save();
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
            category: saveCategory,
            status: 'success',
            message: 'you succeeded in uploading category with image'
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
  } else {
    return res.status(200).json({
      category: updateCategoy,
      status: 'success',
      message: 'you succeeded in uploading category without image'
    });
  }
};

exports.remove = async (req, res) => {
  console.log('ここまできています。');
  const { slug } = req.params;
  const removedCategory = await Category.findOneAndRemove({ slug });

  if (!removedCategory) {
    return res.status(400).json({
      errors: [
        {
          msg: `Could not delet category by this slug ${slug}`
        }
      ],
      status: 'failed'
    });
  }

  console.log('removedCategory', removedCategory);
  const deleteParams = {
    Bucket: 'hacker-stack-contents',
    Key: removedCategory.image.key
  };

  s3.deleteObject(deleteParams, function (err, data) {
    if (err) {
      return res.status(400).json({
        errors: [
          {
            msg: `Error in deleting to s3 file this category/${removedCategory.image.key}`
          }
        ],
        errorData: err,
        status: 'failed'
      });
    }
    console.log('this image deleted', data);
  });

  return res.status(200).json({
    category: removedCategory,
    status: 'success',
    message: 'you succeeded in removing category and s3 storage image'
  });
};
