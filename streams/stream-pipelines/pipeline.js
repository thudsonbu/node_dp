const { pipeline }    = require('stream');
const csvParse        = require('./streams/csv-parse');
const filterByCountry = require('./streams/filter-by-country');
const sumProfit       = require('./streams/sum-profit');

pipeline(
  csvParse,
  filterByCountry,
  sumProfit,

  ( error ) => {
    if ( error ) {
      console.error( error );
      process.exit( 1 );
    }
  }
);
