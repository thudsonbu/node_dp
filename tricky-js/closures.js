const path = require('path');

/**
 * When a function is created, it is given a closure that includes
 * the lexical environment around the function. It gives access to the
 * outer scope within the function.
 */

function outer() {
  const data = 'data';

  function inner() {
    console.log( data );
  }

  inner();
}

outer(); // data


/**
 * Because the closure is based on the lexical environment around a function, it
 * has access to variables even in this environment even after it has been
 * returned.
 */

const outerData = 'outer data';

function functionFactory() {
  const innerData = 'inner data';

  function secondFunction() {
    console.log( innerData );
    console.log( outerData );
  }

  return secondFunction;
}

const fun = functionFactory();

fun(); // prop

/**
 * even props to a factory function are included in the lexical scope
 */

function makePrefixLogger( prefix ) {
  return function( log ) {
    console.log( prefix + ': ' + log );
  }
}

const logger = makePrefixLogger( path.basename( __filename ) );

logger('my log'); // lg: my log

/**
 * Closures also allow you to create private properties in objects using the
 * factory pattern
 */

function createUser( username, password ) {
  return {
    getUsername() {
      return username;
    },

    getPassword() {
      return password.split('').fill('*').join('');
    },

    validatePassword( input ) {
      return password === input;
    }
  }
}

const user = createUser( 'username', 'password' );

console.log( user.getUsername() ); // username
console.log( user.getPassword() ); // ********
console.log( user.password ); // undefined
console.log( user.validatePassword('password') ); // true
