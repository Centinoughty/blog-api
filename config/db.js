const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connection succesful");
  } catch (error) {
    console.log("Connection failed");
  }
};

module.exports = connectDb;
