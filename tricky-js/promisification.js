/* A promise is a proxy for a value not necessarily known when the promise is
created. It allows you to associate handlers with an asynchronous action's
eventual success value or failure reason. Promises van have three states,
they are either, pending, fulfilled, or rejected. Traditionally, when a promise
is settled then() is called when a promise is fulfilled and .catch() is called
when a promise is rejected. */

const myPromise = new Promise( ( resolve, reject ) => {
  setTimeout( () => {
    resolve('foo');
  }, 300 );
});

myPromise
.then( () => {
  console.log('fulfilled1');
})
.then( () => {
  console.log('fulfilled2');
})
.catch( () => {
  console.log('rejected');
});

