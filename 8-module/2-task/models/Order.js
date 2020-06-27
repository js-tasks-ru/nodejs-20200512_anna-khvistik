const mongoose = require('mongoose');
const connection = require('../libs/connection');

const orderSchema = new mongoose.Schema({
  user: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  product: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  phone: {
    required: true,
    type: String,
    validate: [
      {
        validator(value) {
          return /\+?\d{6,14}/.test(value);
        },
        message: 'Неверный формат номера телефона.',
      },
    ],
  },
  address: {
    required: true,
    type: String,
  },
});

module.exports = connection.model('Order', orderSchema);
