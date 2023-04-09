const mongoose = require("mongoose");
const config = require("config");
const jwt = require("jsonwebtoken");

const nameRegex = /^[a-z\s\'\-]+$/i;
const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/i;

const roles = ["admin", "user"];
const sources = ["local", "google", "outlook"];

function stringOptions(customOptions) {
  const defaults = {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  };
  if (customOptions) Object.assign(defaults, customOptions);
  return defaults;
}

const schema = new mongoose.Schema({
  name: stringOptions({
    maxLength: 50,
    match: nameRegex,
  }),
  email: stringOptions({
    maxLength: 50,
    match: emailRegex,
    unique: true,
  }),
  password: stringOptions({ maxLength: 1024 }),
  logins: {
    type: [
      new mongoose.Schema({
        date: { type: Date, required: true },
        ip: { type: String },
      }),
    ],
  },
  role: stringOptions({ enum: roles, default: roles[1] }),
  isActive: { type: Boolean, default: false },
  isConfirmed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  source: stringOptions({ enum: sources, default: sources[0] }),
});

schema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, role: this.role },
    config.get("jwtPrivateKey")
  );
  return token;
};

schema.statics.validate = function (instance) {
  const result = instance.validateSync();
  const isValid = result === undefined;
  return {
    errors: isValid ? undefined : result.errors,
    isValid,
  };
};

module.exports = mongoose.model("user", schema);
