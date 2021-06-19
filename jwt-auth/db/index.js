
const mongoose = require( "mongoose" );

mongoose.connect( "mongodb://host.docker.internal:27017/jwt-auth", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

const db = mongoose.connection;

db.on( "error", console.error.bind( console, "connection error" ) );

db.on( "open", () => {
  console.log( "connected" );
});

module.exports = db;