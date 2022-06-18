const http = require('http');

const json = JSON.stringify({ message: 'hi' });

const req = http.request({
  host: '127.0.0.1',
  port: 6000,
  method: 'POST'
}, (res) => {
  res.resume();
  res.on('end', () => {
    if (!res.complete)
      console.error(
        'The connection was terminated while the message was still being sent'
      );
  });
});

req.write( json );

req.end();
