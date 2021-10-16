const fs   = require( "fs" );
const path = require( "path" );
const User = require( "../models/user" );

// passports jwt strategy implementation
const Jwtstrategy = require( "passport-jwt" ).Strategy;
// used to get token from request header
const ExtractJwt  = require( "passport-jwt" ).ExtractJwt;

const pathToKey = path.join( __dirname, "..", "id_rsa_pub.pem" );
const PUB_KEY   = fs.readFileSync( pathToKey, "utf8" );

// options for jwt setup
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // use auth header
  secretOrKey: PUB_KEY, // use the public key
  algorithms: [ "RS256" ]
};

const stategy = new Jwtstrategy( options, ( payload, done ) => {

  // use 'sub' field of jwt for the user id
  User.findOne({ _id: payload.sub })
    .then( ( user ) => {
      if ( user ) {
        return done( null, user );
      } else {
        return done( null, false );
      }
    })
    .catch( err => ( done( err, null ) ) );

});

module.exports = ( passport ) => {
  passport.use( stategy );
};