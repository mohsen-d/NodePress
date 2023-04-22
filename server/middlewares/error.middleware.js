const winston = require("winston");
const errorsSrv = require("../services/errors.services");

module.exports = function (err, req, res, next) {
  winston.error(err.message, err);

  return res.status(500).send(errorsSrv._500());
};
