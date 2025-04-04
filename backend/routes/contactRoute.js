const express = require("express");
const {sendContactMsg} = require("../controllers/contactController");

const router = express.Router();

router.post("/sendContact", sendContactMsg);

module.exports = router;