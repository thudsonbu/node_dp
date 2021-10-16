const mongoose = require( "mongoose" );

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    hash: {
      type: String,
      required: true
    },
    salt: {
      type: String,
      required: true
    },
    admin: {
      type: Boolean,
      required: true
    }
  }
);

module.exports = mongoose.model( "User", userSchema );