const User = require("../models/user.model");
const usersDb = require("../database/users.db");
const errorsSrv = require("../services/errors.services");
const usersSrv = require("../services/users.services");

module.exports.addUser = async function (req, res) {
  const newUser = new User(req.body);

  const { isValid, errors } = User.validate(newUser);
  if (!isValid) return res.status(400).send(errors);

  const emailExists = await usersDb.emailExists(newUser.email);
  if (emailExists) return res.status(400).send(errorsSrv._400("email"));

  newUser.password = await usersSrv.hashPassword(newUser.password);

  await usersDb.addUser(newUser);

  return res.send(usersSrv.excludePassword(newUser));
};

module.exports.getUsers = async function (req, res) {
  const list = await usersDb.getUsers(req.body);
  return res.send(usersSrv.excludePasswords(list));
};

module.exports.getUser = async function (req, res) {
  const user = await usersDb.getUser(req.params.id);
  if (!user) return res.status(404).send(errorsSrv._404("user"));
  return res.send(usersSrv.excludePassword(user));
};

module.exports.getCurrentUser = async function (req, res) {};
module.exports.updateUsers = async function (req, res) {};
module.exports.updateUser = async function (req, res) {};
module.exports.changeCurrentUserPassword = async function (req, res) {};
module.exports.changeCurrentUserName = async function (req, res) {};
module.exports.deleteUsers = async function (req, res) {};
module.exports.deleteUser = async function (req, res) {};
module.exports.deleteCurrentUser = async function (req, res) {};
module.exports.signIn = async function (req, res) {};
module.exports.signUp = async function (req, res) {};
