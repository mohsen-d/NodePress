const jwt = require("jsonwebtoken");
const config = require("config");
const errorsSrv = require("../services/errors.services");

module.exports = function (req, res, next) {
  const path = req.route.path;

  const needsLoggedInUser = path.startsWith("/user/");
  const needsAdminUser = path.startsWith("/admin/");

  if (!needsLoggedInUser && !needsAdminUser) next();

  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send(errorsSrv._401());

  try {
    req.user = jwt.verify(token, config.get("jwtPrivateKey"));
  } catch (ex) {
    return res.status(400).send(errorsSrv._400("token"));
  }

  if (needsAdminUser && req.user.role !== "admin")
    return res.status(403).send("access denied");

  next();
};
