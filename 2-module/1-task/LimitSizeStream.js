const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this._limit = options.limit;
    this.setEncoding(options.defaultEncoding);
    this.data = '';
  }

  _transform(chunk, encoding, callback) {
    this.data += chunk;

    if (this.data.length > this._limit) {
      callback(new LimitExceededError());
    } else {
      callback(null, chunk);
    }
  }
}

module.exports = LimitSizeStream;
