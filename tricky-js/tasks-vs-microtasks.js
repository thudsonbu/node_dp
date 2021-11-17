function callback() {
  setTimeout(
    () => {
      console.log( 'callback' );
    },
    0
  )
}


function then() {
  count = 0;

  return Promise.resolve().then( () => {
    console.log( 'then' );

    if ( count === 0 ) {
      then();
    }

    count++;
  });
}

function promise() {
  return new Promise( ( resolve, reject ) => {
    console.log( 'promise' );
    resolve();
  });
}

function promiseCallback() {
  let count = 0;

  return new Promise( ( resolve, reject ) => {

    setTimeout(
      () => {
        console.log( 'promiseCallback' );
        resolve();
      },
      0
    );

  });
}

function sync() {
  console.log( 'sync' );
}

promise();
callback();
promiseCallback();
then();
sync();

// OUTPUT:
// promise
// sync
// then
// callback
// promiseCallback

/**
 * Explanation:
 *
 * The promise function creates a promise and in its constructor synchronously
 * runs console.log() and resolves. The callback function creates a standard task
 * and adds it to the queue. The promiseCallback function does the same. The then
 * function executes the constructor and immediately resolves. Since this is a
 * promise and not a callback, it creates a microtask. Microtasks are completed
 * before tasks and when a new microtask created it does not wait till the next
 * process tick, so it executes then once more before the callbacks. Finally
 * in the order that they were qued the callbacks execute, callback, then
 * promiseCallback.
 */
