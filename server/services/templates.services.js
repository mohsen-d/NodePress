const React = require("react");
const { renderToString } = require("react-dom/server");
const config = require("config");
const { App } = require(`../templates/${config.template}/bundle`);
const path = require("path");

module.exports.getContent = function () {
  return renderToString(App);
};

module.exports.getPath = function () {
  return path.join(__dirname, `../templates/${config.template}`);
};
