const { ObjectID } = require("bson");
const client = require("../db/connect");
const { User } = require("../models/user");
const jwt = require ('jsonwebtoken');
const bcrypt = require('bcrypt');


const addUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    let user = new User(
      req.body.name,
      req.body.lastname,
      new Date(req.body.birthday),
      req.body.email,
      hashedPassword,
      req.body.role,
      true,
    );
    let result = await client
      .db()
      .collection("users")
      .insertOne(user);
    
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(501).json(error);
  }
};

const getUsers = async (req, res) => {
  try {
    let cursor = client
      .db()
      .collection("users")
      .find()
      .sort({ name: 1 });
    let result = await cursor.toArray();
    if (result.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(204).json({ msg: "No user found" });
    }
  } catch (error) {
    console.log(error);
    res.status(501).json(error);
  }
};

const getUser = async (req, res) => {
  try {
    let id = new ObjectID(req.params.id);
    let cursor = client.db().collection("users").find({ _id: id });
    let result = await cursor.toArray();
    if (result.length > 0) {
      res.status(200).json(result[0]);
    } else {
      res.status(204).json({ msg: "this user does not exist" });
    }
  } catch (error) {
    console.log(error);
    res.status(501).json(error);
  }
};

const updateUser = async (req, res) => {  
  try {
    let id = new ObjectID(req.params.id);
    let name = req.body.name;
    let lastname = req.body.lastname;
    let birthday = new Date(req.body.birthday);
    let email = req.body.email;
    let role = req.body.role;
    let result = await client
      .db()
      .collection("users")
      .updateOne({ _id: id }, { $set: { name, lastname, birthday, email, role} });

    if (result.modifiedCount === 1) {
      res.status(200).json({ msg: "Updated succefuly" });
    } else {
      res.status(404).json({ msg: "this user does not exist" });
    }
  } catch (error) {
    console.log(error);
    res.status(501).json(error);
  }
};

const updateUserPassword = async (req, res) => {  
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  try {
    let id = new ObjectID(req.params.id);
    let password = hashedPassword;
   
    let result = await client
      .db()
      .collection("users")
      .updateOne({ _id: id }, { $set: {password} });

    if (result.modifiedCount === 1) {
      res.status(200).json({ msg: "Password updated succefuly" });
    } else {
      res.status(404).json({ msg: "this user does not exist" });
    }
  } catch (error) {
    console.log(error);
    res.status(501).json(error);
  }
};
const campareUserPassword = async (req, res) => {
  try {
    let id = new ObjectID(req.body._id);
    let findUser = client.db().collection("users").find({ _id: id });
    let currentUser = await findUser.toArray();
    const password = currentUser.map((item)=>{return item.password;});
      if (await bcrypt.compare(req.body.oldpassword, password.toString())) {
        res.json('Access');
      } else {
        res.send('Wrong old passowrd');
      }
  } catch (error) {
    console.log(error);
  }
};
const deleteUser = async (req, res) => {
  try {
    let id = new ObjectID(req.params.id);
    let result = await client
      .db()
      .collection("users")
      .deleteOne({ _id: id });
    if (result.deletedCount === 1) {
      res.status(200).json({ msg: "deleted succefuly" });
    } else {
      res.status(404).json({ msg: "this user does not exist" });
    }
  } catch (error) {
    console.log(error);

    res.status(501).json(error);
  }
};

const login =  async (req, res) => {
  const user = { email: req.body.email};
  const firstuser = await client.db().collection('users').find(user).toArray();
  const password = firstuser.map((item)=>{return item.password;});
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{expiresIn: "30m"});
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET,{expiresIn: "1y"});

  if(!firstuser==null){
      return res.status(400).send('Cannot find user')
  }else{
      try {
          if(await bcrypt.compare(req.body.password, password.toString())) {
            res.json({accessToken: accessToken,
                      refreshToken: refreshToken});
            res.send('Success');
          } else {
            res.send('Not Allowed');
          }
        } catch {
          res.status(500).send()
        }
  }
};
module.exports = {
  addUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  login,
  updateUserPassword,
  campareUserPassword
};
