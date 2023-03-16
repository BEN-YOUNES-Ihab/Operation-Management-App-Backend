const express = require("express");
const verifyToken = require('../jsonwebtoken/check');

const {
  addDomain,
  getDomains,
  getDomain,
  updateDomain,
  deleteDomain
} = require("../controllers/domain");
const router = express.Router();

router.route("/domains").post(verifyToken, addDomain);
router.route("/domains").get(verifyToken, getDomains);
router.route("/domains/:id").get(verifyToken, getDomain);
router.route("/domains/:id").put(verifyToken, updateDomain);
router.route("/domains/:id").delete(verifyToken, deleteDomain);

module.exports = router;
