const fs               = require('node:fs/promises');
const { pipeline }     = require('node:stream/promises');
const EventEmitter     = require('node:events');
const crypto           = require('node:crypto');
const DBReader         = require('./streams/db-read-stream');
const CompactionStream = require('./streams/compaction-stream');


/**
 * The Compactor performs compaction of the database log removing old keys. It
 * listen to and records update events and then removes out of date keys during
 * downtime.
 */
class Compactor extends EventEmitter {
  constructor( filesDir, dataDelimiter, documentDelimiter ) {
    // The updateLog is a map from the document id to the number of updates
    // that the document has received since the last compaction. This is how
    // many occurrences of a given id can be removed during compaction.
    this.updateLog = new Map();

    this.filesDir = filesDir;
    this.dbReader = new DBReader( dataDelimiter, documentDelimiter );
  }

  /**
   * Perform compaction on the database file by removing keys that were recorded
   * in the updateLog.
   */
  async compact() {
    const newFilePath = `${ this.filesDir }/${ crypto.randomUUID() }`;

    await pipeline(
      fs.createReadStream( this.filePath, { encoding: 'utf-8' } ),
      this.dbReader,
      new CompactionStream( this.updateLog ),
      fs.createWriteStream( newFilePath ),
      ( err ) => {
        console.error( err );
        this.emit( 'compaction error', err );
      }
    );

    this.emit( 'compacted', { newFilePath } );
  }

  /**
   * Add an update to the updateLog for use during the next compaction cycle.
   */
  recordUpdate( update ) {
    if ( this.updateLog.has( update.id ) ) {
      const currentCount = this.updateLog.get( update.id );
      this.updateLog.set( update.id, currentCount + 1 );
    } else {
      this.updateLog.set( update.id, 1 );
    }
  }
}

module.exports = Compactor;
