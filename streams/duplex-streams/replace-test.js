const ReplaceStream = require("./replace-stream");

const replaceStream = new ReplaceStream("World", "Node.js", {
  decodeStrings: false,
});

replaceStream.write("Hello W", "utf-8");
replaceStream.write("orld!", "utf-8");
replaceStream.end();
