const stream = require('stream');

class CSVParse extends stream.Transform {
  constructor( options ) {
    options.objectMode = true;
    super({ ...options });
    this.properties = [];
    this.tail = '';
  }

  _transform( chunk, encoding, callback ) {
    const cleanCut = chunk.endsWith('\n');
    const lines = ( this.tail + chunk ).split('\n');

    if ( !cleanCut ) {
      this.tail = lines.pop();
    } else {
      this.tail = '';
    }

    if ( !this.properties.length && lines.length > 0 ) {
      this.properties = lines.shift().split(',');
    }

    lines.forEach( ( line ) => {
      if ( line.length ) {
        const object = {};
        const datum = line.split(',');

        for ( let i = 0; i < this.properties.length; i++ ) {
          object[ this.properties[ i ] ] = datum[ i ];
        }

        this.push( object );
      }
    });

    callback();
  }

  _flush( callback ) {
    callback();
  }
}

module.exports = CSVParse;
