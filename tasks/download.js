#!/usr/bin/env node

const https = require("https");
const fs = require("fs");

const DEST = "dist/corsget.php";
const SOURCE = "https://gist.githubusercontent.com/sosie-js/0a0b4e683851dcc63aedec98de5ef996/raw/a573d27badf0b8ee58061de91099a8c9eb3b18db/corsget.php";

const file = fs.createWriteStream(DEST);
const request = https
  .get(SOURCE, (response) => {
    response.pipe(file);
    file.on("finish", async () => {
      console.info(`${DEST} is downloaded`);
      file.close();
    });
  })
  .on("error", (error) => {
    fs.unlink(DEST, () => {});
    console.error(error);
  });
