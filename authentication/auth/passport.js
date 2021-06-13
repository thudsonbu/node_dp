// eslint-disable-next-line
const passport             = require( "passport" );
const LocalStrategy        = require( "passport-local" );
const db                   = require( "../db" );
const { validatePassword } = require( "../auth/passwordUtils" );

const User = db.models.User;


// verify callback used by strategy (our implementation of cred ver)
const verifyCallback = ( username, password, done ) => {

  User.find({ username: username })
    .then( ( user ) => {

      if ( !user ) {
        // on failure passport will return a 401
        return done( null, false );
      }

      const isValid = validatePassword( password, user.hash, user.salt );

      if ( isValid ) {
        return done( null, user );
      } else {
        return done( null, false );
      }

    })
    .catch( ( error ) => {
      done( error );
    });

};

// create a strategy
const strategy = new LocalStrategy( verifyCallback );

passport.use( strategy );

passport.serializeUser( ( user, done ) => {
  done( null, user.id );
});

passport.deserializeUser( ( userId, done ) => {

  User.findById( userId )
    .then( ( user ) => {
      done( null, user );
    })
    .catch( ( error ) => {
      done( error );
    });

});