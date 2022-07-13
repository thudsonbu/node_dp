

class DBLock {
  constructor() {
    this.lockRequestQueue = [];
    this.locked           = false;
  }

  /**
   * Acquire a database lock
   *
   * @returns {Promise<Function>} - lock release function
   */
  async acquire() {
    if ( this.locked ) {
      const acquisitionPromise = new Promise( ( resolve, reject ) => {
        this.lockRequestQueue.push( resolve );
      });

      return acquisitionPromise;
    } else {
      this.locked = true;

      return this.release.bind( this );
    }
  }

  /**
   * The release function returned by acquire that either resolves the next
   * lock request in the lock request queue with a release or sets locked to
   * false.
   *
   * @returns {Promise<undefined>} - database lock released
   */
  async release() {
    if ( this.lockRequestQueue.length ) {
      const requestResolve = this.lockRequestQueue.shift();

      requestResolve( this.release.bind( this ) );
    } else {
      this.locked = false;
    }
  }
}

module.exports = DBLock;
