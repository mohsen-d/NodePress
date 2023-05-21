const express = require("express");
const router = express.Router();

const templatesSrv = require("../../services/templates.services");

router.get("/", (req, res) => {
  return res.status(200).send("welcome");
});

router.get("/setup", (req, res) => {
  const content = templatesSrv.getContent();
  res.render("index", { content });
});

module.exports = router;
