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

function functionFactory() {
  const innerProp = 'prop';

  function secondFunction() {
    console.log( innerProp );
  }

  return secondFunction;
}

const fun = functionFactory( 'prop' );

fun(); // prop
