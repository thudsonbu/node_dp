const EventDB   = require('./event-db');
const { faker } = require('@faker-js/faker');

const documentCount = 3;

async function main() {
  try {
    const db = new EventDB('names');

    const names = Array.from({ length: documentCount }).map( () => {
      return faker.name.firstName();
    });

    console.time('insertMany');
    const { results } = await db.insertMany( names );
    console.timeEnd('insertMany');

    const randomDocument = results[
    Math.floor( Math.random() * documentCount )
    ];

    console.log( 'randomDocument', randomDocument );

    console.time('find');
    const found = await db.findById( randomDocument.id );
    console.timeEnd('find');
    console.log( 'found', found );

    console.time('update');
    await db.updateById( randomDocument.id, 'Tom' );
    console.timeEnd('update');

    console.time('findUpdate');
    const updated = await db.findById( randomDocument.id );
    console.timeEnd('findUpdate');
    console.log( 'updated', updated );

    await db.compactor.compact();

    console.time('findUpdate');
    const updated2 = await db.findById( randomDocument.id );
    console.timeEnd('findUpdate');
    console.log( 'updated', updated2 );

  } catch ( err ) {
    console.error( err );
  }
}

main().then();
