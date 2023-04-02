const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  title: { type: String, maxlength: 50, trim: true, required: true },
  url: { type: String, maxlength: 250, trim: true },
  parentId: { type: mongoose.Types.ObjectId },
});

schema.statics.validate = function (instance) {
  const result = instance.validateSync();
  const isValid = result === undefined;
  return {
    errors: isValid ? undefined : result.errors,
    isValid,
  };
};

module.exports = mongoose.model("menu", schema, "menu");
