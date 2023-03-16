const { ObjectID } = require("bson");
const client = require("../db/connect");
const { Domain } = require("../models/domain");


const addDomain = async (req, res) => {
  try {
    let domain = new Domain(
      req.body.name,
      req.body.contractor,
      new Date(req.body.expiration_date),
      req.body.price
    );
    let result = await client
      .db()
      .collection("domains")
      .insertOne(domain);

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(501).json(error);
  }
};

const getDomains = async (req, res) => {
  try {
    let cursor = client
      .db()
      .collection("domains")
      .find()
      .sort({ name: 1 });
    let result = await cursor.toArray();
    if (result.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(204).json({ msg: "No domains found" });
    }
  } catch (error) {
    console.log(error);
    res.status(501).json(error);
  }
};

const getDomain = async (req, res) => {
  try {
    let id = new ObjectID(req.params.id);
    let cursor = client.db().collection("domains").find({ _id: id });
    let result = await cursor.toArray();
    if (result.length > 0) {
      res.status(200).json(result[0]);
    } else {
      res.status(204).json({ msg: "this domain does not exist" });
    }
  } catch (error) {
    console.log(error);
    res.status(501).json(error);
  }
};

const updateDomain = async (req, res) => {
  try {
    let id = new ObjectID(req.params.id);
    let name = req.body.name;
    let contractor = req.body.contractor;
    let expiration_date = new Date(req.body.expiration_date);
    let price = req.body.price;
    let result = await client
      .db()
      .collection("domains")
      .updateOne({ _id: id }, { $set: { name, contractor, expiration_date, price } });

    if (result.modifiedCount === 1) {
      res.status(200).json({ msg: "Updated succefuly" });
    } else {
      res.status(404).json({ msg: "this domain does not exist" });
    }
  } catch (error) {
    console.log(error);
    res.status(501).json(error);
  }
};

const deleteDomain = async (req, res) => {
  try {
    let id = new ObjectID(req.params.id);
    let result = await client
      .db()
      .collection("domains")
      .deleteOne({ _id: id });
    if (result.deletedCount === 1) {
      res.status(200).json({ msg: "deleted succefuly" });
    } else {
      res.status(404).json({ msg: "this domains does not exist" });
    }
  } catch (error) {
    console.log(error);

    res.status(501).json(error);
  }
};


module.exports = {
  addDomain,
  getDomains,
  getDomain,
  updateDomain,
  deleteDomain
};
