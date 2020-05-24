const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
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
  }
}

module.exports = LineSplitStream;
