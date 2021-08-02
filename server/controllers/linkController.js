const fs = require('fs');
const Link = require('../models/link');
const slugify = require('slugify');
const formidable = require('formidable');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

exports.create = async (req, res) => {
  const { title, url, categories, type, medium } = req.body;
  console.table({ title, url, categories, type, medium });
};
exports.list = async (req, res) => {};
exports.read = async (req, res) => {};
exports.update = async (req, res) => {};
exports.remove = async (req, res) => {};
