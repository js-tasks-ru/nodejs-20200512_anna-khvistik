const url = require('url');
const http = require('http');
const path = require('path');
const LimitSizeStream = require('./LimitSizeStream');
const fs = require('fs');
const util = require('util');
const stream = require('stream');

const server = new http.Server();
const pipeline = util.promisify(stream.pipeline);

const MAX_FILE_SIZE = 1024 * 1024;

function checkFileExists(filepath) {
  return new Promise((resolve) => {
    fs.access(filepath, fs.F_OK, (error) => {
      resolve(!error);
    });
  });
}

server.on('request', async (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const withNestedDirectories = pathname.includes('/') || pathname.includes('..');
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (withNestedDirectories) {
        res.statusCode = 400;
        res.end();
        return;
      }

      const exists = await checkFileExists(filepath);
      if (exists) {
        res.statusCode = 409;
        res.end('File already exists');
        return;
      }

      const limitSizeStream = new LimitSizeStream({limit: MAX_FILE_SIZE});

      limitSizeStream.on('error', () => {
        res.statusCode = 413;
        res.end('File should be less than 1mb');
      });

      const writeStream = fs.createWriteStream(filepath);

      res.on('close', () => {
        if (res.finished) {
          return;
        }
        fs.unlinkSync(filepath);
        writeStream.destroy();
        limitSizeStream.destroy();
      });

      await pipeline(req, limitSizeStream, writeStream);
      res.statusCode = 201;
      res.end();
    break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});


module.exports = server;
