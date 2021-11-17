function callback() {
  setTimeout(
    () => {
      console.log( 'callback' );
    },
    0
  )
}

function then() {
  return Promise.resolve().then( () => {
    console.log( 'then' );
  });
}

function promise() {
  return new Promise( ( resolve, reject ) => {
    console.log( 'promise' );
    resolve();
  });
}

function promiseCallback() {
  return new Promise( ( resolve, reject ) => {
    setTimeout(
      () => {
        console.log( 'promiseCallback' );
        resolve();
      },
      0
    )
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
