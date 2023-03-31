const Joi = require("joi");

module.exports.buildGetParameters = function (req, params) {
  if (req.user.isAuthenticated) return params;
  params.display = true;
  return params;
};

module.exports.buildGetFilter = function (parameters) {
  const filter = {};

  for (const param in parameters) {
    if (parameters[param] === undefined || parameters[param] === null) continue;

    switch (true) {
      case ["_id", "display"].includes(param):
        filter[param] = parameters[param];
        break;

      case [
        "author",
        "subTitle",
        "title",
        "content",
        "urlTitle",
        "tags",
      ].includes(param):
        filter[param] = new RegExp(parameters[param], "i");
        break;

      case param == "publish":
        filter[param] = {
          $gte: parameters[param].from,
          $lte: parameters[param].to,
        };
        break;
    }
  }
  return filter;
};

module.exports.buildGetOptions = function (parameters = {}) {
  const options = {};

  const sortSchema = Joi.object({
    by: Joi.string()
      .required()
      .valid("author", "subtitle", "title", "urltitle", "publish"),
    order: Joi.number().required().valid(1, -1),
  }).required();

  let validationResult = sortSchema.validate(parameters.sort);
  options.sort = validationResult.error
    ? { publish: -1 }
    : { [validationResult.value.by]: validationResult.value.order };

  const pageSizeSchema = Joi.number().required().min(10).max(50);
  validationResult = pageSizeSchema.validate(parameters.pageSize);
  options.limit = validationResult.error ? 10 : validationResult.value;

  const pageSchema = Joi.number().required().min(1).max(1000);
  validationResult = pageSchema.validate(parameters.page);
  options.skip = validationResult.error
    ? 0
    : (validationResult.value - 1) * options.limit;

  return options;
};
