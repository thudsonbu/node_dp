const EventDB   = require('./event-db');
const { faker } = require('@faker-js/faker');

async function main() {
  const db = new EventDB('names');

  const names = Array.from({ length: 5000 }).map( () => {
    return faker.name.firstName();
  });

  console.time('insertMany');
  const { results } = await db.insertMany( names );
  console.timeEnd('insertMany');

  const randomDocument = results[ Math.floor( Math.random() * 5000 ) ];

  console.time('find');
  const found = await db.findById( randomDocument.id );
  console.timeEnd('find');

  console.log( 'found', found );
  console.log( 'actual', randomDocument );
}

main().then();
