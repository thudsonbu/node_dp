# Summary
This repository demonstrates how to properly introduce session based authentication with express using the hash and salt method to the IEEE spec. There are simple routes that demonstrate the system in action and below you can find a complete explanation of what the more interesting parts of the code are doing. 

# Background

### Quick Definitions

*Authentication* - identify that the user is who they say they are

*Authorization* - what permissions does the user have

*O-Auth* - fancier authenticaton system that also adds in the ability to manage permissions with the o-auth provider (like google)

### Passport.js

`Passport.js` is a middleware (it goes between our backend logit and the router). 

Steps:

1. Pickup the strategy authentication strategy that is being used
2. Is the user authenticated
    1. If authentication is succesful then let user into express route else go away
    2. If authentication fails return `401` status code (unauthorized)

### HTTP Headers

Headers are sent with every http request and give information about a given request. They can be broken into three categories:

*General Headers* - the general metadata like what type of request was made, what was the status code that was returned, what ip address was resolved by the DNS...

*Request Headers* - instructions for the server that the client is requesting data from like what type of data we accept (html, xml...), what route we are going to, what browser is being used also known as the `user-agent`,  

*Response Headers* - instructions for the client as to how to interact with the server, gives what kind of data was sent back, has the `set-cookie` header

For more info on headers see [https://developer.mozilla.org/en-US/docs/Web/HTTP/Header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers)s 

### Session and Cookies

The first thing to think about when thinking about cookies is that http is a *stateless protocol*, it will forget what the user has done on the site unless we have a way to remember that.

*Session* based authentication sends a cookie back to the browser which indicates the the user has been authenticated for additional requests by adding `set-cookie` in teh response header.

When the client reponds the next time it will send in the *request headers* a `cookie` with key value pairs for each of the cookies that were give in `set-cookie` by the initial response

Once the client has the cookie, the other thing to consider is how long the cookie should last. We do that with the `expires` piece of the http header.

# Middleware

Middle wearch are functions that the `request`, `response`, and `next` (callback) are passed through on their way to the routes. These parameters are passed to each route.  You can have as many of them as you want. If you want to go to the next step in the chain then you call `next` if you want to send something back imediately then you would do `response.send()` . 

In express, `app.use()` adds a piece to the chain of middleware. 

One pattern that is pretty common when chaining middleware and often come in handy is adding properties to the objects that are being passed through the middleware.

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
