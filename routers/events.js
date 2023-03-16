const express = require("express");
const verifyToken = require('../jsonwebtoken/check');
const {
  addEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent
} = require("../controllers/event");
const router = express.Router();

router.route("/events").post(verifyToken, addEvent);
router.route("/events").get(getEvents);
router.route("/events/:id").get(verifyToken, getEvent);
router.route("/events/:id").put(verifyToken, updateEvent);
router.route("/events/:id").delete(verifyToken, deleteEvent);

module.exports = router;
