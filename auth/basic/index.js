const express  = require('express');
const mongoose = require('mongoose');
const session  = require('express-session');
const passport = require('passport');
const crypto   = require('crypto');
const routes   = require('./routes');
const db       = require('./db');

const MongoStore = require('connect-mongo')( session );

require('dotenv').config();

const app = express();

app.use( express.json() );
app.use( express.urlencoded({ extended: true }) );

// setup passport store
const sessionStore = new MongoStore({
  mongooseConnection: db,
  collection: 'sessions'
});

// get access to .env file
require('dotenv').config();

// configure express-session (passport will use this)
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);

// pull in passport config
require('./auth/passport');

// add passport middleware to express
app.use( passport.initialize() );
app.use( passport.session() );

// add routes to express
app.use( routes );

// set app to listen on port 3000
app.listen( 3000, () => { console.log('app listening on port 3000'); } );
