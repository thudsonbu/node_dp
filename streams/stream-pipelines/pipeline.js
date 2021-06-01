const { pipeline }    = require( "stream" );
const csvParse        = require( "./csv-parse" );
const filterByCountry = require( "./filter-by-country" );
const sumProfit       = require( "./sum-profit" );

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