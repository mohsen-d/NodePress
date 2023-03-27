const express = require("express");

const app = express();

app.get("/", (req, res) => {
  const isConfigured = false;
  if (!isConfigured) res.redirect("/setup");
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  console.log(`server is listening on port ${port}`)
);

module.exports = server;
