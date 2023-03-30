module.exports.buildGetParameters = function (req, params) {
  if (req.user.isAuthenticated) return params;
  params.display = true;
  return params;
};
