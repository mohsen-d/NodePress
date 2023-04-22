const config = require("config");

module.exports = {
  _404: (resource = "resource") => buildTheMsg(404, resource),
  _400: (action = "data") => buildTheMsg(400, action),
  _401: () => buildTheMsg(401),
  _403: () => buildTheMsg(403),
  _500: () => buildTheMsg(500),
};

function buildTheMsg(code, msgVariable = "") {
  return config.get(`errors.${code}`).replace(`$var`, msgVariable);
}
