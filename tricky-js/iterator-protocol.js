
const string = 'string';

// iterable objects implement that @@iterator method
// accessed with the Symbol.iterator key
const stringIterator = string[Symbol.iterator]();

const firstLetter = stringIterator.next();

console.log( firstLetter );

// counter is an iterable with an iterator function that returns increments
class Counter {
  constructor( increment, maximum ) {
    this.increment = increment;
    this.maximum = maximum;
  }

  [Symbol.iterator]() {
    const increment = this.increment;
    const maximum   = this.maximum;

    let count = 0;

    return {
      next: () => {
        count = count + increment;

        if ( count < maximum ) {
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

const threes = new Counter( 3, 10 );

for ( const number of threes ) {
  console.log( number ); // 3, 6, 9
}
