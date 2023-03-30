module.exports.buildGetParameters = function (req, params) {
  if (req.user.isAuthenticated) return params;
  params.display = true;
  return params;
};

module.exports.buildGetFilter = function (parameters) {
  const filter = {};

  for (const param in parameters) {
    if (parameters[param] === undefined || parameters[param] === null) continue;

    switch (true) {
      case ["_id", "display"].includes(param):
        filter[param] = parameters[param];
        break;

      case [
        "author",
        "subTitle",
        "title",
        "content",
        "urlTitle",
        "tags",
      ].includes(param):
        filter[param] = new RegExp(parameters[param], "i");
        break;

      case param == "publish":
        filter[param] = {
          $gte: parameters[param].from,
          $lte: parameters[param].to,
        };
        break;
    }
  }
  return filter;
};
