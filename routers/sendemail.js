const express = require("express");
const verifyToken = require('../jsonwebtoken/check');
const {
  sendEmail,
  getInvite,
  getInvites,
  deleteInvite,
  updateInvite
} = require("../controllers/sendemail");
const router = express.Router();

router.route("/send_email").post(verifyToken, sendEmail);
router.route("/send_email/:email").get(getInvite);
router.route("/send_email").get(verifyToken, getInvites);
router.route("/send_email/:email").put(updateInvite);
router.route("/send_email/:email").delete(verifyToken, deleteInvite);
module.exports = router;
