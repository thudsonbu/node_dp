const { createHmac } = require('crypto');

// original class
class SecureResource {
  #password = 'pass';

  constructor( password ) {
    this.password  = password;
    this.map       = new Map();
  }

  get( key ) {
    if ( this.password === this.#password ) {
      return this.map.get( key );
    }
  }

  set( key, value ) {
    if ( this.password === this.#password ) {
      this.map.set( key, value );
    }
  }
}

// factory
function createSecureResource() {
  return new SecureResource( 'pass' );
}

// user doesn't know password
const resource = createSecureResource();

resource.set( 'key', 'value' );
const value = resource.get( 'key' );

console.log( value );
