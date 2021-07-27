// @Method
// @Desc
// @Role
exports.register = (req, res) => {
  console.log('register');
  res.json({ data: 'you hit register endpoint middleware using controller' });
};
