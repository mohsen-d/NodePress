const User = require("../models/user.model");
const usersDb = require("../database/users.db");
const errorsSrv = require("../services/errors.services");
const usersSrv = require("../services/users.services");
const emailSrv = require("../services/email.services");

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
  const userId = req.baseUrl == "/admin" ? req.params.id : req.user.id;
  const user = await usersDb.getUser(userId);
  if (!user) return res.status(404).send(errorsSrv._404("user"));
  return res.send(usersSrv.excludePassword(user));
};

module.exports.updateUsers = async function (req, res) {
  const updateCommand = usersSrv.buildUpdateCommand(req.body);
  const result = await usersDb.updateUsers(req.body.ids, updateCommand);
  return res.send(result);
};

module.exports.updateUser = async function (req, res) {
  const user = await usersDb.getUser(req.params.id);
  if (!user) return res.status(404).send(errorsSrv._400("user"));

  const fields = usersSrv.filterUpdateFields(req.body);

  Object.assign(user, fields);

  const { errors, isValid } = User.validate(user);
  if (!isValid) return res.status(400).send(errors);

  if (fields.password) user.password = usersSrv.hashPassword(user.password);

  const updatedUser = await usersDb.updateUser(user);
  return res.send(usersSrv.excludePassword(updatedUser));
};

module.exports.changeCurrentUserPassword = async function (req, res) {
  const user = await usersDb.getUser(req.user.id);

  const isPasswordValid = await usersSrv.comparePasswords(
    req.body.currentPassword,
    user.password
  );
  if (!isPasswordValid) return res.status(400).send(errorsSrv._400("password"));

  user.password = req.body.newPassword;

  const { isValid, errors } = User.validate(user);
  if (!isValid) return res.status(400).send(errorsSrv._400("password"));

  user.password = await usersSrv.hashPassword(user.password);

  await usersDb.updateUser(user);

  return res.send(true);
};

module.exports.changeCurrentUserName = async function (req, res) {
  let user = await usersDb.getUser(req.user.id);

  user.name = req.body.name;

  const { isValid, errors } = User.validate(user);
  if (!isValid) return res.status(400).send(errorsSrv._400("name"));

  user = await usersDb.updateUser(user);

  return res.send(user);
};

module.exports.deleteUsers = async function (req, res) {
  const result = await usersDb.deleteUsers(req.body.ids);
  return res.send(result);
};

module.exports.deleteUser = async function (req, res) {
  const user = await usersDb.deleteUser(req.params.id);

  if (!user) return res.status(404).send(errorsSrv._404("user"));

  return res.send(user);
};

module.exports.deleteCurrentUser = async function (req, res) {
  const user = await usersDb.getUser(req.user.id);

  const isValidPassword = await usersSrv.comparePasswords(
    req.body.password,
    user.password
  );

  if (!isValidPassword) return res.status(400).send(errorsSrv._400("password"));

  const deletedUser = await usersDb.deleteUser(req.user.id);

  return res.send(deletedUser ? true : false);
};

module.exports.signIn = async function (req, res) {
  const user = await usersDb.getByEmail(req.body.email);
  if (!user) return res.status(400).send(errorsSrv._400("email/password"));

  const isValidPassword = usersSrv.comparePasswords(
    req.body.password,
    user.password
  );
  if (!isValidPassword)
    return res.status(400).send(errorsSrv._400("email/password"));

  user.logins.push({
    date: Date.now,
    ip: req.ip,
  });
  await usersDb.updateUser(user);

  const token = user.generateAuthToken();
  return res.send(token);
};

module.exports.signUp = async function (req, res) {
  const fields = usersSrv.filterSignupFields(req.body);

  const newUser = new User(fields);

  const { errors, isValid } = User.validate(newUser);
  if (!isValid) return res.status(400).send(errors);

  const emailExists = await usersDb.emailExists(newUser.email);
  if (emailExists) return res.status(400).send(errorsSrv._400("email"));

  newUser.password = await usersSrv.hashPassword(newUser.password);

  newUser.setToken();

  const addedUser = await usersDb.addUser(newUser);

  if (!addedUser) return res.send(false);

  await emailSrv.sendConfirmEmail(newUser.token.toHexString());

  return res.send(true);
};

module.exports.confirm = async function (req, res) {
  const user = await usersDb.getByToken(req.params.token);

  if (!user) return res.status(404).send(errorsSrv._404("user"));

  user.isConfirmed = true;
  user.token = undefined;

  const updatedUser = await usersDb.updateUser(user);

  if (!updatedUser) {
    return res.send(false);
  }

  await emailSrv.sendAccountStatusEmail(user.email, "confirmed");

  return res.send(true);
};

module.exports.sendPasswordRecoveryEmail = async function (req, res) {
  const user = await usersDb.getByEmail(req.params.email);

  if (!user) return res.status(404).send(errorsSrv._404("user"));

  user.setToken();

  const updatedUser = await usersDb.updateUser(user);

  if (!updatedUser) return res.send(false);

  await emailSrv.sendPasswordRecoveryEmail(user.email, user.token);

  return res.send(true);
};
