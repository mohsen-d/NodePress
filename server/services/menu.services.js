const Joi = require("joi");

module.exports.buildGetFilter = function (parameters) {
  const filter = {};
  const params = { ...parameters };

  const schema = Joi.object({
    _id: Joi.string().hex().length(24),
    parentId: Joi.string().hex().length(24),
    ancestors: Joi.string().hex().length(24),
    title: Joi.string().max(50).truncate(),
    url: Joi.string().max(50).truncate(),
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
      case ["_id", "parentId", "ancestors"].includes(param):
        filter[param] = params[param];
        break;

      case ["title", "url"].includes(param):
        filter[param] = new RegExp(params[param].substring(0, 50), "i");
        break;
    }
  }
  return filter;
};

module.exports.buildGetOptions = function (parameters = {}) {
  const options = {};

  const sortSchema = Joi.object({
    by: Joi.string().required().valid("title"),
    order: Joi.number().required().valid(1, -1),
  }).required();

  let validationResult = sortSchema.validate(parameters.sort);
  options.sort = validationResult.error
    ? { title: 1 }
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
