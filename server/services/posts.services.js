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

module.exports.buildGetOptions = function (parameters = {}) {
  const options = {};

  options.sort = parameters.sort || { publish: -1 };
  options.limit = parameters.pageSize || 10;
  options.skip = parameters.page ? (parameters.page - 1) * options.limit : 0;

  return options;
};
