const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

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
    case 'DELETE':
      if (withNestedDirectories) {
        res.statusCode = 400;
        res.end('Nested directories are not supported');
        return;
      }

      const exists = await checkFileExists(filepath);
      if (!exists) {
        res.statusCode = 404;
        res.end('File does not exist.');
        return;
      }

      res.on('close', () => {
        if (res.finished) {
          return;
        }
        
        writeStream.destroy();
        limitSizeStream.destroy();
      });

      fs.unlinkSync(filepath);
      res.end();
    break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
