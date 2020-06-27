const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');
const mapOrder = require('../mappers/order');

module.exports.checkout = async function checkout(ctx, next) {
  const {product, phone, address} = ctx.request.body;
  const order = await Order.create({
    product,
    phone,
    address,
    user: ctx.user.id,
  });

  await sendMail({
    template: 'order-confirmation',
    locals: {product, id: order.id},
    to: ctx.user.email,
    subject: 'Заказ',
  });

  ctx.body = {
    order: order.id,
  };
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const orders = await Order.find({user: ctx.user.id}).populate('product');

  ctx.body = {orders: orders.map(mapOrder)};
};
