

class Record {
  constructor() {
    this.record = '';
  }

  init( prevRecord ) {
    this.record = prevRecord;
  }

  log( something ) {
    this.record = this.record + '\n' + something;
  }

  read() {
    console.log( this.record );
  }
}

class AppendOnlyRecord {
  constructor( executor ) {
    const record = new Record();

    this.log  = record.log.bind( record );
    this.read = record.read.bind( record );

    const init = record.init.bind( record );

    executor( init );
  }
}

const myRecorder = new AppendOnlyRecord(
  ( init ) => { init( 'Log Start' ) }
);

myRecorder.log('log 0');
myRecorder.log('log 1');

myRecorder.read();
