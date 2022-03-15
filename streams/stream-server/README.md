# Stream Server

This module demonstrates a typical client-server interaction over http when using streams. In `stream-client` we send an http `PUT` request with a file from `sent-files` to the server created in `stream-server` that is compressed with Gzip and encrypted using AES192.

### Run the Program

First in one shell, start the stream server with:
```bash
node stream-server.js
```
This will provide you with a secret key to use.

Second to send the client request use:
```bash
node stream-client.js message.txt <key>
```
Where `<key>` is the key generated and output by the server.
