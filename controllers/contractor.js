const { ObjectID } = require("bson");
const client = require("../db/connect");
const { Contractor } = require("../models/contractor");


const addContractor = async (req, res) => {
  try {
    let contractor = new Contractor(
      req.body.name
    );
    let result = await client
      .db()
      .collection("contractors")
      .insertOne(contractor);

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(501).json(error);
  }
};

const getContractors = async (req, res) => {
  try {
    let cursor = client
      .db()
      .collection("contractors")
      .find()
      .sort({ name: 1 });
    let result = await cursor.toArray();
    if (result.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(204).json({ msg: "No contractors found" });
    }
  } catch (error) {
    console.log(error);
    res.status(501).json(error);
  }
};

const getContractor = async (req, res) => {
  try {
    let id = new ObjectID(req.params.id);
    let cursor = client.db().collection("contractors").find({ _id: id });
    let result = await cursor.toArray();
    if (result.length > 0) {
      res.status(200).json(result[0]);
    } else {
      res.status(204).json({ msg: "this contractor does not exist" });
    }
  } catch (error) {
    console.log(error);
    res.status(501).json(error);
  }
};

const updateContractor = async (req, res) => {
  try {
    let id = new ObjectID(req.params.id);
    let name = req.body.name;
    let result = await client
      .db()
      .collection("contractors")
      .updateOne({ _id: id }, { $set: { name } });

    if (result.modifiedCount === 1) {
      res.status(200).json({ msg: "Updated succefuly" });
    } else {
      res.status(404).json({ msg: "this contractor does not exist" });
    }
  } catch (error) {
    console.log(error);
    res.status(501).json(error);
  }
};

const deleteContractor = async (req, res) => {
  try {
    let id = new ObjectID(req.params.id);
    let result = await client
      .db()
      .collection("contractors")
      .deleteOne({ _id: id });
    if (result.deletedCount === 1) {
      res.status(200).json({ msg: "deleted succefuly" });
    } else {
      res.status(404).json({ msg: "this contractor does not exist" });
    }
  } catch (error) {
    console.log(error);

    res.status(501).json(error);
  }
};


module.exports = {
  addContractor,
  getContractors,
  getContractor,
  updateContractor,
  deleteContractor
};
