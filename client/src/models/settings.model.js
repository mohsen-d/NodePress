import Joi from "joi";
import utils from "../services/utils.services";

const rules = {
  title: Joi.string().trim().max(100).empty("").label("site title"),
  description: Joi.string().trim().empty("").max(150),
  keywords: Joi.custom(function (value) {
    value = value.trim();
    if (value === undefined || value === "") return value;
    const keywords = [];
    value.split(",").forEach((k) => {
      k = k.trim();
      if (k.length > 0) keywords.push(k.length <= 2 ? k : k.substring(0, 2));
    });
    return keywords;
  }),
  favicon: Joi.custom(utils.validateImage(10 * 1024)),
  banner: Joi.custom(utils.validateImage(100 * 1024)),
  copyright: Joi.string().trim().empty("").max(150).label("copyright text"),
  landingPage: Joi.boolean(),
  enableMembership: Joi.boolean(),
};

export const fields = {
  title: {
    type: "text",
    label: "Site title:",
    placeholder: "example: my blog",
  },
  description: {
    type: "text",
    label: "A short description:",
    placeholder: "example: a blog about daily events",
  },
  keywords: {
    type: "text",
    label: "Keywords:",
    placeholder: "example: blog, daily_life, events",
  },
  favicon: {
    type: "file",
    label: "Favicon:",
    placeholder: "",
  },
  banner: {
    type: "file",
    label: "Banner:",
    placeholder: "",
  },
  copyright: {
    type: "text",
    label: "Copyright:",
    placeholder: "example: all rights reserved for author",
  },
  landingPage: {
    type: "checkbox",
    label: "Have a landing page?",
    placeholder: "",
  },
  enableMembership: {
    type: "checkbox",
    label: "Enable membership?",
    placeholder: "",
  },
};

const schema = Joi.object(rules).options({
  stripUnknown: true,
});

export function validate(inputs) {
  const result = schema.validate(inputs, { abortEarly: false });
  return {
    value: result.value,
    error: utils.extractErrors(result),
  };
}

export function validateField(fieldName, fieldValue) {
  return utils.extractErrors(rules[fieldName].validate(fieldValue), fieldName);
}
