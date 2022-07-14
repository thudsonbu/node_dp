# Event Emitter DB

## Description

The event emitter db is a simple version of a document database implemented
using log structured storage. It serves as a good example of utilizing events
and asynchronous functions cohesively as well as the fundamentals of database
design.

## Todo

- [ ] Use `db-read-stream` in `find-stream`/`find`
- [ ] Add `update` and `updateMany` methods
- [ ] Use a `write-stream` for `insertMany` instead of buffering the `blob`
