const url = require('url');
const http = require('http');
const path = require('path');
const LimitSizeStream = require('./LimitSizeStream');
const fs = require('fs');

const server = new http.Server();

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

      const writeStream = fs.createWriteStream(filepath);

      limitSizeStream.on('error', (err) => {
        if (err.code === 'LIMIT_EXCEEDED') {
          res.statusCode = 413;
          res.end('File size exceeded');
        } else {
          res.statusCode = 500;
          res.end('Internal server error');
        }
        fs.unlink(filepath, ()=> {});
        writeStream.destroy();
        limitSizeStream.destroy();
      });

      res.on('close', () => {
        if (res.finished) {
          return;
        }
        fs.unlink(filepath, ()=> {});
        writeStream.destroy();
        limitSizeStream.destroy();
      });

      writeStream.on('close', ()=>{
        res.statusCode = 201;
        res.end();
      });

      req.pipe(limitSizeStream).pipe(writeStream);
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});


module.exports = server;
