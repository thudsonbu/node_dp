const { createServer } = require("http");
const { createGunzip } = require("zlib");
const { createWriteStream } = require("fs");
const { basename, join } = require("path");
const { createDecipheriv, randomBytes } = require("crypto");

const secret = randomBytes(24);
console.log(`Generated secret: ${secret.toString("hex")}`);

const server = createServer((req, res) => {
  const filename = basename(req.headers["x-filename"]);
  const initVector = Buffer.from(req.headers["x-initialization-vector"], "hex");
  const destFilename = join("received_files", filename);

  console.log(`File request received: ${filename}`);

  req
    .pipe(createDecipheriv("aes192", secret, initVector))
    .pipe(createGunzip())
    .pipe(createWriteStream(destFilename))
    .on("finish", () => {
      res.writeHead(201, { "Content-Type": "text/plain" });
      res.end("OK\n");

      console.log(`File saved: ${destFilename}`);
    });
});

server.listen(3000, () => console.log("Listening on port 3000"));
