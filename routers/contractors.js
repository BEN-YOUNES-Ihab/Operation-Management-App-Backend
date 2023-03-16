const express = require("express");
const verifyToken = require('../jsonwebtoken/check');

const {
  addContractor,
  getContractors,
  getContractor,
  updateContractor,
  deleteContractor
} = require("../controllers/contractor");
const router = express.Router();

router.route("/contractors").post(verifyToken, addContractor);
router.route("/contractors").get(verifyToken, getContractors);
router.route("/contractors/:id").get(verifyToken, getContractor);
router.route("/contractors/:id").put(verifyToken, updateContractor);
router.route("/contractors/:id").delete(verifyToken, deleteContractor);

module.exports = router;
