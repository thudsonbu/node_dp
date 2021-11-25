
const string = 'string';

// iterable objects implement that @@iterator method
// accessed with the Symbol.iterator key
const stringIterator = string[Symbol.iterator]();

const firstLetter = stringIterator.next();

console.log( firstLetter );

// counter is an iterable with an iterator function 
class Counter {
  constructor( increment ) {
    this.increment = increment;
  }

  [Symbol.iterator]() {
    let count = 0;
    let increment = this.increment;

    return {
      next: () => {
        count = count + increment;

        if ( count < 100 ) {
          return {
            value: count,
            done: false
          }
        } else {
          return {
            done: true
          }
        }
      }
    }
  }
}

const threes = new Counter( 3 );

for ( const number of threes ) {
  console.log( number );
}
