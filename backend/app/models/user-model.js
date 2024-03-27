const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  email: String,
  password: String,
  phone: Number,
  role: {
    type: String,
    enum: ["private", "public", "admin"],
    default: "public",
  },
  profile: {
    name: String,
    bio: String,
  },
});

const Users = model("Users", userSchema);
module.exports = Users;
