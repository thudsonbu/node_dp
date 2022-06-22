// original class
class MyDivider {
  constructor( dividend ) {
    this.dividend = dividend;
  }

  divide( divisor ) {
    return this.dividend / divisor;
  }
}

const divider = new MyDivider( 2 );

console.log( divider.divide( 4 ) ); // 2
console.log( divider.divide( 0 ) ); // Infinity

class SafeDivider {
  constructor( divider ) {
    this.divider = divider;
  }

  // proxy'd method
  divide( divisor ) {
    if ( divisor === 0 ) {
      throw new Error('Divide By Zero Exception');
    }

    return this.divider.divide( divisor );
  }
}

const safeDivider = new SafeDivider( divider );

try {
  safeDivider.divide( 0 );
} catch ( err ) {
  console.log( err ); // Divide By Zero Exception
}
