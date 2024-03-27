const User = require("../models/user-model");
const { validationResult } = require("express-validator");
const bcryptjs = require("bcryptjs");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const userCtrl = {};

userCtrl.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const body = req.body;
    console.log(body);
    const user = new User(body);
    const salt = await bcryptjs.genSalt();
    const encryptedPassword = await bcryptjs.hash(user.password, salt);
    user.password = encryptedPassword;
    user.save();
    return res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json("Internal server error");
  }
};

userCtrl.Login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const body = req.body;
    const loginData = _.pick(body, ["email", "password", "role"]);
    console.log(loginData);
    const user = await User.findOne({ email: loginData.email });
    //console.log(user);
    if (!user) {
      return res.status(404).json({ errors: "Invalid email or password" });
    }
    const checkPassword = await bcryptjs.compare(
      loginData.password,
      user.password
    );
    //console.log(checkPassword);
    if (!checkPassword) {
      return res.status(404).json({ errors: "Invalid email id or password" });
    }
    const tokenData = {
      id: user._id,
      role: user.role,
    };
    console.log("tokendata", tokenData);
    const token = jwt.sign(tokenData, process.env.JWT_SECRET);

    return res.json({ token: token });
  } catch (err) {
    return res.json(err);
  }
};

userCtrl.account = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select({ password: 0 });
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json("Internal server error");
  }
};

userCtrl.allUsers = async (req, res) => {
  try {
    //checking if user is admin
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const user = await User.find();
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json("Internal server error");
  }
};

userCtrl.publicProfile = async (req, res) => {
  try {
    const user = await User.find({ role: "public" });
    return res.json(user);
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
};

userCtrl.viewProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json("Internal server error");
  }
};

userCtrl.editProfile = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const body = req.body;
    console.log(body);
    const user = await User.findByIdAndUpdate(
      id,
      { ...body },
      {
        new: true,
        runValidators: true,
      }
    );
    //console.log(user);
    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

userCtrl.signout = async (req, res) => {
  try {
    res.clearCookie("jwt");
    return res.status(200).json({ message: "signout successful" });
  } catch (err) {
    return res.status(500).json("Internal server error");
  }
};
module.exports = userCtrl;
