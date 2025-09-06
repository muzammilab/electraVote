const User = require("../model/user");

exports.getRole = async (req, res, next) => {
  // const userData = req.user;
  const user = await User.findById(req.user.id);

  console.log(user.data);

  res.status(200).json({ user });
};