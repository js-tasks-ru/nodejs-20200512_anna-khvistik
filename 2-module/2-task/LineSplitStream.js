const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
<<<<<<< HEAD
    this.buffer = [];
    this.encoding = options.encoding || 'utf8';
  }

  _transform(chunk, encoding, callback) {
    this.buffer.push(chunk);
    callback(null);
  }

  _flush(callback) {
    const str = Buffer.concat(this.buffer).toString(this.encoding);
    const lines = str.split(os.EOL);
    lines.forEach((line) =>{
      this.push(line);
    });
    callback();
=======
  }

  _transform(chunk, encoding, callback) {
  }

  _flush(callback) {
>>>>>>> 67acf18f07b7b8c021bb778ac5af489a24e5a539
  }
}

module.exports = LineSplitStream;
