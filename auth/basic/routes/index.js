const router              = require('express').Router();
const passport            = require('passport');
const { genPassword }     = require('../auth/passwordUtils');
const db                  = require('../db');
const user                = require('../models/user');
const { isAuth, isAdmin } = require('./authMiddleware');


router.post( '/login',
  passport.authenticate( 'local',
    {
      failureRedirect: '/login-failure',
      successRedirect: '/login-success'
    }
  )
);

router.post( '/register', ( req, res, next ) => {
  const saltHash = genPassword( req.body.password );

  const  salt = saltHash.salt;
  const hash = saltHash.hash;

  const newUser = new user({
    username: req.body.username,
    hash,
    salt,
    admin: true
  });

  newUser.save()
  .then( ( newUser ) => {
    console.log( newUser );
  });

  res.redirect('/login');
});

router.get( '/', ( req, res, next ) => {
  res.send('<h1>Home</h1><p>Please <a href="/register">register</a></p>');
});

router.get( '/login', ( req, res, next ) => {

  const form = '<h1>Login Page</h1><form method="POST" action="/login">\
    Enter Username:<br><input type="text" name="username">\
    <br>Enter Password:<br><input type="password" name="password">\
    <br><br><input type="submit" value="Submit"></form>';

  res.send( form );

});

router.get( '/register', ( req, res, next ) => {

  const form =
		'<h1>Register Page</h1><form method="post" action="register">\
		Enter Username:<br><input type="text" name="username">\
		<br>Enter Password:<br><input type="password" name="password">\
		<br><br><input type="submit" value="Submit"></form>';

  res.send( form );

});

router.get( '/logout', ( req, res, next ) => {
  req.logout();
  res.redirect('/protected-route');
});

router.get( '/login-success', ( req, res, next ) => {
  res.send(
    '<p>You successfully logged in. --> <a href="/protected-route">' +
		'Go to protected route</a></p>' );
});

router.get( '/login-failure', ( req, res, next ) => {
  res.send('You entered the wrong password.');
});

router.get( '/protected-route', isAuth, ( req, res, next ) => {
  res.send('Welcome to the protected route');
});

router.get( '/admin-route', isAdmin, ( req, res, next ) => {
  res.send('Welcome to the admin route.');
});

module.exports = router;
