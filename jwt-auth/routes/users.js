
const mongoose = require( "mongoose" );
const router   = require( "express" ).Router();
const User     = mongoose.model( "User" );
const passport = require( "passport" );
const utils    = require( "../lib/utils" );

router.get( "/protected", ( req, res, next ) => {
});

router.post( "/login", function( req, res, next ) {

});

router.post( "/register", function( req, res, next ) {
  const { hash, salt } = utils.genPassword( req.body.password );

  const newUser = new User({
    username: req.body.username,
    hash: hash,
    salt: salt
  });

	newUser.save();

	

});

module.exports = router;