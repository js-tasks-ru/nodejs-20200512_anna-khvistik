const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const stream = require('stream');
const util = require('util');

const server = new http.Server();
const pipeline = util.promisify(stream.pipeline);

function checkFileExists(filepath) {
  return new Promise((resolve, reject) => {
    fs.access(filepath, fs.F_OK, (error) => {
      resolve(!error);
    });
  });
}

server.on('request', async (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const withNestedDirectories = pathname.includes('/');
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      if (withNestedDirectories) {
        res.statusCode = 400;
        res.end();
        return;
      }

      const exists = await checkFileExists(filepath);
      if (!exists) {
        res.statusCode = 404;
        res.end();
        return;
      }

      try {
        const readStream = fs.createReadStream(filepath);
        await pipeline(readStream, res);
        res.end();
      } catch (err) {
        res.statusCode = 501;
        res.end();
      }
      break;
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
