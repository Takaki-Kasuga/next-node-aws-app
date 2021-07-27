// @Method  POST
// @Desc
// @Role
exports.register = (req, res) => {
  console.log('register req.body', req.body);
  res.json({ data: 'you hit register endpoint middleware using controller' });
};
