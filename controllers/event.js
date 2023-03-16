const { ObjectID } = require("bson");
const client = require("../db/connect");
const { Event } = require("../models/event");


const addEvent = async (req, res) => {
  try {
    let event = new Event(
      req.body.title,
      new Date(req.body.date),
      req.body.description,
      req.body.type,
      req.body.category,
      req.body.value
    );
    let result = await client
      .db()
      .collection("events")
      .insertOne(event);

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(501).json(error);
  }
};

const getEvents = async (req, res) => {
  try {
    let cursor = client
      .db()
      .collection("events")
      .find()
      .sort({ name: 1 });
    let result = await cursor.toArray();
    if (result.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(204).json({ msg: "No events found" });
    }
  } catch (error) {
    console.log(error);
    res.status(501).json(error);
  }
};

const getEvent = async (req, res) => {
  try {
    let id = new ObjectID(req.params.id);
    let cursor = client.db().collection("events").find({ _id: id });
    let result = await cursor.toArray();
    if (result.length > 0) {
      res.status(200).json(result[0]);
    } else {
      res.status(204).json({ msg: "this event does not exist" });
    }
  } catch (error) {
    console.log(error);
    res.status(501).json(error);
  }
};

const updateEvent = async (req, res) => {
  try {
    let id = new ObjectID(req.params.id);
    let title = req.body.title;
    let date = new Date(req.body.date);
    let description = req.body.description;
    let type = req.body.type;
    let category = req.body.category;
    let value = req.body.value;

    let result = await client
      .db()
      .collection("events")
      .updateOne({ _id: id }, { $set: { title, date, description, type, category, value} });

    if (result.modifiedCount === 1) {
      res.status(200).json({ msg: "Updated succefuly" });
    } else {
      res.status(404).json({ msg: "this event does not exist" });
    }
  } catch (error) {
    console.log(error);
    res.status(501).json(error);
  }
};

const deleteEvent = async (req, res) => {
  try {
    let id = new ObjectID(req.params.id);
    let result = await client
      .db()
      .collection("events")
      .deleteOne({ _id: id });
    if (result.deletedCount === 1) {
      res.status(200).json({ msg: "deleted succefuly" });
    } else {
      res.status(404).json({ msg: "this events does not exist" });
    }
  } catch (error) {
    console.log(error);

    res.status(501).json(error);
  }
};


module.exports = {
  addEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent
};
