const Joi = require("joi");

const schema = Joi.object({
  domain: Joi.string().max(50),
  database: Joi.string().max(150),
  jwtPrivateKey: Joi.string().max(50),
  mail: Joi.object().keys({
    host: Joi.string().max(50),
    port: Joi.number().max(9999),
    username: Joi.string().max(50),
    password: Joi.string().max(50),
    from: Joi.string().max(50),
  }),
  errors: Joi.object().keys({
    404: Joi.string().max(150),
    400: Joi.string().max(150),
    401: Joi.string().max(150),
    403: Joi.string().max(150),
    500: Joi.string().max(150),
  }),
}).options({ stripUnknown: true });

module.exports.validate = function (config) {
  return schema.validate(config, { abortEarly: false });
};
