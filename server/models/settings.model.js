const mongoose = require("mongoose");

const validateKeywords = {
  validator: function (keywords) {
    if (keywords.length == 0) return true;

    return keywords.every((k) => {
      k = k.trim();
      return k.length > 0 && k.length < 51;
    });
  },
  message: "keywords should be between 1 and 50 characters long",
};

function stringOptions(customOptions) {
  const defaults = {
    type: String,
    required: true,
    trim: true,
  };
  if (customOptions) Object.assign(defaults, customOptions);
  return defaults;
}

const schema = new mongoose.Schema({
  title: stringOptions({ maxLength: 100, default: "Site Title" }),
  description: stringOptions({ required: false, maxLength: 150 }),
  keywords: { type: [String], validate: validateKeywords },
  favicon: stringOptions({ maxLength: 50, default: "favicon.png" }),
  banner: stringOptions({ required: false, maxLength: 50 }),
  copyright: stringOptions({
    maxLength: 150,
    default: function () {
      return `&copy; ${new Date().getFullYear()} ${
        this.title
      } | All rights reserved `;
    },
  }),
  landingPage: { type: Boolean, default: false },
  enableMembership: { type: Boolean, default: false },
  isSiteDown: { type: Boolean, default: false },
});

schema.statics.validate = function (instance) {
  const result = instance.validateSync();
  const isValid = result === undefined;
  return {
    errors: isValid ? undefined : result.errors,
    isValid,
  };
};

module.exports = mongoose.model("Settings", schema, "settings");
