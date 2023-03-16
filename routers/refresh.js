const express = require("express");

const refresh = require('../jsonwebtoken/refresh');
const router = express.Router();

router.route("/refresh").post(refresh);


module.exports = router;
