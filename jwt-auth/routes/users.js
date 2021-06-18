
const mongoose = require( "mongoose" );
const router   = require( "express" ).Router();
const User     = mongoose.model( "User" );
const passport = require( "passport" );
const utils    = require( "../lib/utils" );

router.get( "/protected", ( req, res, next ) => {
});

router.post( "/login", function( req, res, next ) {});

router.post( "/register", function( req, res, next ) {});

module.exports = router;