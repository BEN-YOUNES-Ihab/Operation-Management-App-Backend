const express = require("express");
const verifyToken = require('../jsonwebtoken/check');
const {
  addUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  login,
  updateUserPassword,
  campareUserPassword
} = require("../controllers/user");
const router = express.Router();

router.route("/users").post(addUser);
router.route("/users").get(verifyToken, getUsers);
router.route("/users/password/:id").post(verifyToken, campareUserPassword);
router.route("/users/:id").get(verifyToken, getUser);
router.route("/users/:id").put(verifyToken, updateUser);
router.route("/users/password/:id").put(verifyToken, updateUserPassword);
router.route("/users/:id").delete(verifyToken, deleteUser);
router.route("/users/login").post(login);

module.exports = router;
