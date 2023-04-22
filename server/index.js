const express = require("express");
const app = express();

require("./startup/db.startup")();
require("./startup/routes.startup")(app);

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  console.log(`server is listening on port ${port}`)
);

module.exports = server;
