const express = require("express");
const verifyToken = require('../jsonwebtoken/check');

const {
  addCategory,
  getCategory,
  getCategorys,
  updateCategory,
  deleteCategory
} = require("../controllers/category");
const router = express.Router();

router.route("/categorys").post(verifyToken, addCategory);
router.route("/categorys").get(verifyToken, getCategorys);
router.route("/categorys/:id").get(verifyToken, getCategory);
router.route("/categorys/:id").put(verifyToken, updateCategory);
router.route("/categorys/:id").delete(verifyToken, deleteCategory);

module.exports = router;
