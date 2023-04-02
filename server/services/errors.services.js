const config = require("config");

module.exports = {
  _404: (resource = "resource") => buildTheMsg(404, resource),
  _400: (action = "do the task") => buildTheMsg(400, action),
};

function buildTheMsg(code, msgVariable) {
  return config.get(`errors.${code}`).replace(`$var`, msgVariable);
}
