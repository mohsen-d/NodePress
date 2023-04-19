const mongoose = require("mongoose");
const config = require("config");
const jwt = require("jsonwebtoken");

const nameRegex = /^[a-z\s\'\-]+$/i;
const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/i;
const passwordRegex =
  /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,16}$/;

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
  password: stringOptions({ lowercase: false, maxLength: 1024 }),
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
  token: { type: mongoose.SchemaTypes.ObjectId },
  source: stringOptions({
    enum: sources,
    default: sources[0],
  }),
});

schema.methods.setToken = function () {
  this.token = new mongoose.Types.ObjectId();
};

schema.methods.removeToken = function () {
  this.token = undefined;
};

schema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, role: this.role },
    config.get("jwtPrivateKey")
  );
  return token;
};

schema.statics.validate = function (instance) {
  let result = instance.validateSync();
  let isValid = result === undefined;

  if (isValid && !passwordRegex.test(instance.password)) {
    isValid = false;
    result = {
      errors: {
        password: {
          kind: "regex",
          path: "password",
          value: instance.password,
          message: "invalid password",
        },
      },
    };
  }

  return {
    errors: isValid ? undefined : result.errors,
    isValid,
  };
};

module.exports = mongoose.model("user", schema);
