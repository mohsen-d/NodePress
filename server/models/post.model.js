const mongoose = require("mongoose");

const validateTags = {
  validator: function (tags) {
    if (tags.length == 0) return true;

    return tags.every((t) => {
      t = t.trim();
      return t.length > 0 && t.length < 51;
    });
  },
  message: "tags should be between 1 and 50 characters long",
};

const schema = new mongoose.Schema({
  author: { type: String },
  subTitle: { type: String, trim: true, maxlength: 50 },
  title: { type: String, maxlength: 250, trim: true, required: true },
  content: { type: String, trim: true, required: true },
  urlTitle: { type: String, maxlength: 50, trim: true },
  tags: { type: [String], validate: validateTags },
  publish: { type: Date, default: Date.now },
  display: { type: Boolean, default: true },
  showInFeed: { type: Boolean, default: true },
});

schema.statics.validate = function (instance) {
  const result = instance.validateSync();
  const isValid = result === undefined;
  return {
    errors: isValid ? undefined : result.errors,
    isValid,
  };
};

module.exports = mongoose.model("Post", schema);
