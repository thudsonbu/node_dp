const { Transform } = require('stream');

class ParallelStream extends Transform {
  constructor( userTransform, opts ) {
    super({ objectMode: true, ...opts });

    this.userTransform = userTransform;
    this.running = 0;
    this.terminateCb = null;
  }

  _transform( chunk, enc, done ) {
    this.running++;

    // dont wait on the asynchronous user transform function to run in parallel
    this.userTransform( chunk, enc, this.push.bind( this ) );

    done();
  }

  _flush( done ) {
    if ( this.running > 0 ) {
      this.terminateCb = done;
    } else {
      done();
    }
  }

  _onComplete( err ) {
    this.running--;

    if ( err ) {
      return this.emit( 'error', err );
    }

    if ( this.running === 0 ) {
      this.terminateCb && this.terminateCb();
    }
  }
}

module.exports = ParallelStream;
