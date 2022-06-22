const stream = require('stream');

class FilterByCountry extends stream.Transform {
  constructor( country, options ) {
    super({ ...options });

    options.objectMode = true;
    this.country = country;
  }

  _transform( object, encoding, callback ) {
    if ( object.country === this.country ) {
      this.push( object );
    }

    callback();
  }
}

module.exports = FilterByCountry;
