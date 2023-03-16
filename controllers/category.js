const { ObjectID } = require("bson");
const client = require("../db/connect");
const { Category } = require("../models/category");


const addCategory = async (req, res) => {
  try {
    let category = new Category(
      req.body.name
    );
    let result = await client
      .db()
      .collection("categorys")
      .insertOne(category);

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(501).json(error);
  }
};

const getCategorys = async (req, res) => {
  try {
    let cursor = client
      .db()
      .collection("categorys")
      .find()
      .sort({ name: 1 });
    let result = await cursor.toArray();
    if (result.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(204).json({ msg: "No categorys found" });
    }
  } catch (error) {
    console.log(error);
    res.status(501).json(error);
  }
};

const getCategory = async (req, res) => {
  try {
    let id = new ObjectID(req.params.id);
    let cursor = client.db().collection("categorys").find({ _id: id });
    let result = await cursor.toArray();
    if (result.length > 0) {
      res.status(200).json(result[0]);
    } else {
      res.status(204).json({ msg: "this category does not exist" });
    }
  } catch (error) {
    console.log(error);
    res.status(501).json(error);
  }
};

const updateCategory = async (req, res) => {
  try {
    let id = new ObjectID(req.params.id);
    let name = req.body.name;
    let result = await client
      .db()
      .collection("categorys")
      .updateOne({ _id: id }, { $set: { name } });

    if (result.modifiedCount === 1) {
      res.status(200).json({ msg: "Updated succefuly" });
    } else {
      res.status(404).json({ msg: "this category does not exist" });
    }
  } catch (error) {
    console.log(error);
    res.status(501).json(error);
  }
};

const deleteCategory = async (req, res) => {
  try {
    let id = new ObjectID(req.params.id);
    let result = await client
      .db()
      .collection("categorys")
      .deleteOne({ _id: id });
    if (result.deletedCount === 1) {
      res.status(200).json({ msg: "deleted succefuly" });
    } else {
      res.status(404).json({ msg: "this category does not exist" });
    }
  } catch (error) {
    console.log(error);

    res.status(501).json(error);
  }
};


module.exports = {
  addCategory,
  getCategorys,
  getCategory,
  updateCategory,
  deleteCategory
};
