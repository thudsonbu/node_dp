const passport      = require( "passport" );
const LocalStrategy = require( "passport-local" );
const db            = require( "../db" );

const User = db.models.User;


// verify callback used by strategy (our implementation of cred ver)
const verifyCallback = ( username, password, done ) => {

  User.find( { username: username } )
    .then( ( user ) => {

      if ( !user ) {
        return cb( null, false );
      }
    } );

};

// create a strategy
const strategy = new LocalStrategy();