const { createReadStream, createWriteStream } = require("fs");
const { pipeline } = require("stream");
const split = require("split");
const superagent = require("superagent");
const { ParallelStream } = require("./parallel-stream");

pipeline(
  createReadStream(process.argv[2]),
  split(),

  new ParallelStream(async (url, enc, push, done) => {
    if (!url) {
      return done();
    }

    try {
      await superagent.head(url, { timeout: 5 * 1000 });
      push(`${url} is up\n`);
    } catch (error) {
      push(`${url} is down\n`);
    }
  }),

  createWriteStream("results.txt"),

  (error) => {
    if (error) {
      console.error(error);
      process.exit(1);
    }

    console.log("All urls have been checked");
  }
);
