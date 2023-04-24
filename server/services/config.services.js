const config = require("config");
const fs = require("fs");
const path = require("path");

const configFilePath = path.resolve(__dirname, "../../config/default.json");

module.exports.getUndefinedFields = function () {
  return getConfigUndefinedProps(config);
};

module.exports.updateConfigFields = function (newValues) {
  if (anyUpdates(newValues)) {
    const configFileContent = readConfigFile();

    updateConfigUndefinedProps(config, configFileContent, newValues);

    rewriteConfigFile(configFileContent);
  }
};

function getConfigUndefinedProps(obj) {
  const props = { ...obj };

  Object.keys(obj).forEach((k) => {
    if (typeof obj[k] === "object") {
      props[k] = getConfigUndefinedProps(obj[k]);
      if (Object.keys(props[k]).length == 0) delete props[k];
    } else if (obj[k] !== "undefined") delete props[k];
  });

  return props;
}

function updateConfigUndefinedProps(currentConfig, oldValues, newValues) {
  Object.keys(newValues).forEach((k) => {
    if (typeof currentConfig[k] === "object") {
      updateConfigUndefinedProps(currentConfig[k], oldValues[k], newValues[k]);
    } else if (currentConfig[k] === undefined) {
      currentConfig[k] = oldValues[k] = newValues[k];
    }
  });
}

function rewriteConfigFile(configFileContent) {
  fs.writeFileSync(configFilePath, JSON.stringify(configFileContent));
}

function readConfigFile() {
  const fileContent = fs.readFileSync(configFilePath, "utf-8");
  return JSON.parse(fileContent);
}

function anyUpdates(values) {
  return Object.keys(values).length > 0 ? true : false;
}
