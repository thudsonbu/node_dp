const CSVParse = require("./csv-parse");

const csvParse = new CSVParse({ decodeStrings: false });

csvParse.write("Firstname,Lastn");
csvParse.write("ame\nThomas,Hudson\n");

csvParse.end();
