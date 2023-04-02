const mongoose = require("mongoose");
const errorsSrv = require("../services/errors.services");

module.exports = function (req, res, next) {
  if (shallIntercept(req)) {
    if (req.params.id && !areValid([req.params.id]))
      return res.status(400).send(errorsSrv._400("id"));
    if (req.body.ids && !areValid(req.body.ids))
      return res.status(400).send(errorsSrv._400("ids"));
  }
  next();
};

const areValid = (ids) => {
  return ids.every((id) => mongoose.Types.ObjectId.isValid(id));
};

const shallIntercept = (req) => {
  const methodsToIntercept = ["get", "delete", "put"];

  if (!methodsToIntercept.includes(req.method)) return false;
  if (!req.params.id && !req.body.ids) return false;

  return true;
};
