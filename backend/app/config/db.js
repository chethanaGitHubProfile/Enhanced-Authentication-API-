const mongoose = require("mongoose");
const configureDB = async () => {
  try {
    const db = await mongoose.connect(
      "mongodb://127.0.0.1:27017/authentication-API"
    );
    console.log("connected to DB");
  } catch (err) {
    console.log("error in connected to DB");
  }
};

module.exports = configureDB;
