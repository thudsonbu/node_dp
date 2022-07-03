const EventDB = require('./event-db');

async function main() {
  const db = new EventDB('names');

  db.on( 'result', d => console.log( d ) );

  const { id, data } = await db.insert('tom');

  await db.find( id );
}

main().then();
