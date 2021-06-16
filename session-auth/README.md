# Summary
This repository demonstrates how to properly introduce session based authentication
with express. There are simple routes that demonstrate the system in action and
below you can find a complete explanation of what the more interesting parts of 
the code are doing. 

# Passport Local Strategy

### Create a Strategy (passport config)

When using a local strategy in passport, the first step is to create a function that passport will use to verify a user. All this means is checking the user session store that passport uses for the user. This will be placed inside of the passport config file `auth/passport.js`. We then create an instance of a local strategy and pass it to passport. Finally we add serialize and deserialize user described a bit farther down. Essentially they tell passport how to add a user (serialize) and how to get a user (deserialize).

```jsx
const passport         = require( "passport" );
const LocalStrategy    = require( "passport-local" );
const db               = require( "../db" );
const validatePassword = require( "../auth/passwordUtils" );

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
```

### Add Passport to Middleware of Route

In express each of the function passed to a route act as a data pipeline. In the below example, we add `passport.authenticate` to this pipeline which will cause the passport middleware to run when route is hit. The second example for `/register` uses our custom `genPassword()` function from `auth/passwordUtils` to create a salted hash of the password.
```jsx
router.post( "/login",
  passport.authenticate( "local",
    {
      failureRedirect: "/login-failure",
      successRedirect: "/login-success"
    }
  )
);

router.post( "/register", ( req, res, next ) => {
  const saltHash = genPassword( req.body.password );

  const salt = saltHash.salt;
  const hash = saltHash.hash;

  const newUser = new user({
    username: req.body.username,
    hash: hash,
    salt: salt,
    admin: true
  });

  newUser.save()
    .then( ( newUser ) => {
      console.log( newUser );
    });

  res.redirect( "/login" );
});
```

### Initialize Passport and Session in App.js

There are a few things going on here. After we get the basic app setup with a database and express, we create a `MongoStore` that will be used by `express-session` to store its authentication state. We then create the collection associated with the mongo store. 

The next step is to tell express to use `express-session` and do some configuration for it most importantly specifying our store, the max age of the cookie, and the secret.

Finally we add our configured session based auth to express with passport as configured above.

```jsx
const express    = require( "express" );
const mongoose   = require( "mongoose" );
const session    = require( "express-session" );
const passport   = require( "passport" );
const crypto     = require( "crypto" );
const routes     = require( "./routes" );
const db         = require( "./db" );

const MongoStore = require( "connect-mongo" )( session );

const app = express();

app.use( express.json() );
app.use( express.urlencoded({ extended: true }) );

// setup passport store
const sessionStore = new MongoStore({
  mongooseConnection: db,
  collection: "sessions"
});

// get access to .env file
require( "dotenv" ).config();

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
require( "./auth/passport" );

app.use( passport.initialize() );
app.use( passport.session() );

app.use( routes );

app.listen( 3000 );
```

Each time we go to a route `app.use( passport.initialize() );` creates a passport instance which with a config file. We then provide passport with a refrences to `express session` with `app.use( passport.session() )` which will show passport where to look for the sesson data.

### Creating Password & Verifying Password

When a new user creates a username and password we will need to store it in our database securely. This can be done by taking the password that has been sent to us in plain text (we can't do anything about that) and hashing and salting it. This is important because the salt prevents the use of a rainbow list of password hashes: The use of the same password will reveal the same hash and it could be possible to match the hash with a generic rainbow hash list giving away the password. By introducing a salt, even the same password will not yield the same hash because the salts are almost certain to be different.

```jsx
function genPassword( password ) {
  const salt = crypto.randomBytes( 32 ).toString( "hex" );

  const hash = crypto.pbkdf2Sync(
    password,
    salt,
    10000,
    64,
    "sha512"
  ).toString( "hex" );

  return {
    salt,
    hash
  };
}
```

Later, when a user goes to sign in to our app with the password we can verify that it is legit by performing the same hash and salt operation and comparing the result with what we have stored in the db.

```jsx
function validatePassword( password, hash, salt ) {

  const reqHash = crypto.pbkdf2Sync(
    password,
    salt,
    10000,
    64,
    "sha512"
  ).toString( "hex" );

  return reqHash === hash;
}
```

### Serialize and Deserialize Users

When a user is authenticated, passport runs `passport.serializeUser` which adds the `passport` prop to the session with the user id in the below example.

```jsx
passport.serializeUser( ( user, done ) => {
  done( null, user.id );
});
```

The deserialize user function is used when we try to get the user from passport with `req.user` . This is implemented below.

```jsx
passport.deserializeUser( ( userId, done ) => {

  User.findById( userId )
    .then( ( user ) => {
      done( null, user );
    })
    .catch( ( error ) => {
      done( error );
    });

});
```