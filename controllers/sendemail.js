const { ObjectID } = require("bson");
const client = require("../db/connect");
const nodemailer = require("nodemailer");
const { Invite } = require("../models/invite");

const sendEmail = async (req, res) => {
  try {
      var from = "ben.younes.ihab3@gmail.com";
      var to = req.body.to;
      var role = req.body.role
      var subject = req.body.subject;
      var message = req.body.message;
    
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: 'ben.younes.ihab3@gmail.com',
          pass: 'nuiyhjgmjwwidbbp'
        }
      })
    
      var mailOptions = {
          from: from,
          to:to,
          subject:subject,
          text:message
      }
    
      transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            res.json({error1: error});
          } else {
            res.json({success: info.response});
          }
      });

      let invite = new Invite(
        to,
        true,
        role
      );
      let result = await client
        .db()
        .collection("invites")
        .insertOne(invite);
  
      res.status(200).json(result);
  } catch (error) {
    res.json({error2: error});

  }
};

const getInvite = async (req, res) => {
  try {
    let cursor = client.db().collection("invites").find({ email: req.params.email });
    let result = await cursor.toArray();
    if (result.length > 0) {
      res.status(200).json(result[0]);
    } else {
      res.status(204).json({ msg: "this invite does not exist" });
    }
  } catch (error) {
    console.log(error);
    res.status(501).json(error);
  }
};
const getInvites = async (req, res) => {
  try {
    let cursor = client
      .db()
      .collection("invites")
      .find()
      .sort({ name: 1 });
    let result = await cursor.toArray();
    if (result.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(204).json({ msg: "No invite found" });
    }
  } catch (error) {
    console.log(error);
    res.status(501).json(error);
  }
};
const updateInvite = async (req, res) => {
  try {
    let email = req.body.email;
    let isactive = false;

    let result = await client
      .db()
      .collection("invites")
      .updateOne({ email: req.params.email }, { $set: { email, isactive } });

    if (result.modifiedCount === 1) {
      res.status(200).json({ msg: "Updated succefuly" });
    } else {
      res.status(404).json({ msg: "this invite does not exist" });
    }
  } catch (error) {
    console.log(error);
    res.status(501).json(error);
  }
};
const deleteInvite = async (req, res) => {
  try {
    let result = await client
      .db()
      .collection("invites")
      .deleteOne({ email: req.params.email});
    if (result.deletedCount === 1) {
      res.status(200).json({ msg: "deleted succefuly" });
    } else {
      res.status(404).json({ msg: "this invite does not exist" });
    }
  } catch (error) {
    console.log(error);

    res.status(501).json(error);
  }
};
module.exports = {
  sendEmail,
  getInvites,
  getInvite,
  updateInvite,
  deleteInvite,
};
  