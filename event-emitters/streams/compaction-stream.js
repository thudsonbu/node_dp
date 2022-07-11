const { Transform }        = require('node:stream');
const createDocumentString = require('../utils/create-document-string');

/**
 * The CompactionStream receives data from the un-compacted current database
 * file, removes out of date documents, and then writes to a new file that the
 * database will begin using after compaction is complete.
 */
class CompactionStream extends Transform {
  constructor( updateLog ) {
    super();

    this.updateLog = updateLog;
  }

  async _transform( document, encoding, callback ) {

    if ( !this.updateLog.has( document.id ) ) {
      this.push( createDocumentString( document ) );
    } else {
      const currentCount = this.updateLog.get( document.id );

      if ( currentCount === 1 ) {
        this.updateLog.delete( document.id );
      } else {
        this.updateLog.set( document.id, currentCount - 1 );
      }
    }

    callback();
  }

  async _flush( callback ) {
    callback();
  }
}

module.exports = CompactionStream;
