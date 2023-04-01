const Joi = require("joi");

module.exports.buildGetParameters = function (req, params) {
  if (req.user.isAuthenticated) return params;
  params.display = true;
  return params;
};

module.exports.buildGetFilter = function (parameters) {
  const filter = {};
  const params = { ...parameters };

  const schema = Joi.object({
    _id: Joi.string().hex().length(24),
    author: Joi.string().max(50).truncate(),
    subTitle: Joi.string().max(50).truncate(),
    title: Joi.string().max(50).truncate(),
    content: Joi.string().max(50).truncate(),
    urlTitle: Joi.string().max(50).truncate(),
    tags: Joi.string().max(50).truncate(),
    display: Joi.boolean(),
    publish: Joi.object().keys({
      from: Joi.date(),
      to: Joi.date(),
    }),
  });

  const { value, error } = schema.validate(params, { abortEarly: false });

  if (error) {
    error.details.forEach((d) => {
      const key = d.context.key;
      delete params[key];
    });
  }

  for (const param in params) {
    if (params[param] === undefined || params[param] === null) continue;

    switch (true) {
      case ["_id", "display"].includes(param):
        filter[param] = params[param];
        break;

      case [
        "author",
        "subTitle",
        "title",
        "content",
        "urlTitle",
        "tags",
      ].includes(param):
        filter[param] = new RegExp(params[param].substring(0, 50), "i");
        break;

      case param == "publish":
        filter[param] = {
          $gte: params[param].from,
          $lte: params[param].to,
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

  const pageSizeSchema = Joi.number().required().min(1).max(50);
  validationResult = pageSizeSchema.validate(parameters.pageSize);
  options.limit = validationResult.error ? 10 : validationResult.value;

  const pageSchema = Joi.number().required().min(1).max(1000);
  validationResult = pageSchema.validate(parameters.page);
  options.skip = validationResult.error
    ? 0
    : (validationResult.value - 1) * options.limit;

  return options;
};
