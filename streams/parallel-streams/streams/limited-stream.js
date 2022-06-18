const { Transform } = require( "stream" );

class ParallelStream extends Transform {
  constructor( concurrency, userTransform, opts ) {
    super( { objectMode: true, ...opts } );

    this.concurrency = concurrency;
    this.userTransform = userTransform;
    this.running = 0;
    this.terminateCb = null;
    this.continueCb = null;
  }

  _transform( chunk, enc, done ) {
    this.running++;

    // dont wait on the asynchronous user transform function to run in parallel
    this.userTransform( chunk, enc, this.push.bind( this ) );

    if ( this.running < this.concurrency ) {
      done();
    } else {
      this.continueCb = done;
    }
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
      return this.emit( "error", err );
    }

    this.continueCb = null;

    // unblock stream allowing next chunk to be processed
    this.continueCb && this.continueCb();

    if ( this.running === 0 ) {
      this.terminateCb && this.terminateCb();
    }
  }
}

module.exports = ParallelStream;
