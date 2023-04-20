const User = require("../models/user.model");
const usersSrv = require("../services/users.services");

module.exports.addUser = async function (newUser) {
  await newUser.save();
  return newUser;
};

module.exports.getUsers = async function (parameters) {
  const filters = usersSrv.buildGetFilter(parameters);
  const options = usersSrv.buildGetOptions(parameters);

  const list = await User.find(filters, null, options);
  return list;
};

module.exports.getUser = async function (id) {
  const user = await User.findById(id);
  return user;
};

module.exports.emailExists = async function (email) {
  const result = await User.find({ email: email }).count();
  return result > 0;
};

module.exports.updateUsers = async function (ids, updateCommand) {
  const result = await User.updateMany({ _id: { $in: ids } }, updateCommand);
  return result.modifiedCount;
};

module.exports.updateUser = async function (user) {
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { $set: user },
    {
      returnDocument: "after",
    }
  );
  return updatedUser;
};

module.exports.getByEmail = async function (email) {
  const result = await User.findOne({
    email: email,
    isActive: true,
    isConfirmed: true,
  });

  return result;
};

module.exports.deleteUsers = async function (ids) {
  const result = await User.deleteMany({ _id: { $in: ids } });
  return result.deletedCount;
};

module.exports.deleteUser = async function (id) {
  const deletedUser = await User.findByIdAndDelete(id);
  return deletedUser;
};

module.exports.getByToken = async function (token) {
  const result = await User.findOne({
    token: token,
  });

  return result;
};
