
const mongoose = require( "mongoose" );
const router   = require( "express" ).Router();
const User     = require( "../models/user" );
const passport = require( "passport" );
const utils    = require( "../lib/utils" );

router.get( "/protected",
  passport.authenticate( "jwt", { session: false }), ( req, res, next ) => {
    res.status( 200 ).json({
      success: true,
      msg: "You are successfully authenticated to this route!"
    });
  }
);

// Validate an existing user and issue a JWT
router.post( "/login", function( req, res, next ) {

  User.findOne({ username: req.body.username })
    .then( ( user ) => {
      if ( !user ) {
        return res.status( 401 ).json({
          success: false,
          msg: "could not find user" // should not give away info in prod
        });
      }

      // Function defined at bottom of app.js
      const isValid = utils.validPassword(
        req.body.password,
        user.hash,
        user.salt
      );

      if ( isValid ) {
        const tokenObject = utils.issueJWT( user );

        res.status( 200 ).json({
          success: true,
          token: tokenObject.token,
          expiresIn: tokenObject.expires
        });
      } else {
        res.status( 401 ).json({
          success: false,
          msg: "you entered the wrong password" // should not give info in prod
        });
      }

    })
    .catch( ( err ) => {
      next( err );
    });
});

router.post( "/register", function( req, res, next ) {
  const { hash, salt } = utils.genPassword( req.body.password );

  const newUser = new User({
    username: req.body.username,
    hash: hash,
    salt: salt
  });

  newUser.save()
    .then( ( user ) => {
      const jwt = utils.issueJWT( user );

      res.json({
        success: true,
        user: user,
        token: jwt.token,
        expiresIn: jwt.expires
      });
    })
    .catch( err => next( err ) );
});

module.exports = router;