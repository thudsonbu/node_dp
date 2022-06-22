const { join }     = require('path');
const ToFileStream = require('./custom-writeable');

const tfs = new ToFileStream();

tfs.write(
  {
    path: join( 'files', 'hello.txt' ),
    content: 'Hello'
  },
  'utf-8',
  () => {
    console.log('Wrote hello.txt');
  }
);

tfs.write({
  path: join( 'files', 'hi.txt' ),
  content: 'hi'
});

tfs.end( () => console.log('All files created') );
