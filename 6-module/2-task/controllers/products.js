const Product = require('../models/Product');

const mapProduct = ({
  category,
  description,
  images,
  price,
  subcategory,
  title,
  _id,
}) => {
  return {
    category,
    description,
    images,
    price,
    subcategory,
    title,
    id: _id,
  };
};

module.exports.productsBySubcategory = async function productsBySubcategory(
    ctx,
    next
) {
  const {subcategory} = ctx.request.query;
  if (!subcategory) {
    return next();
  }
  const products = await Product.find({
    subcategory,
  });

  ctx.body = {products: products.map(mapProduct)};
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find({});
  ctx.body = {products: products.map(mapProduct)};
};

module.exports.productById = async function productById(ctx, next) {
  const product = await Product.findById(ctx.params.id);
  if (!product) {
    ctx.throw(404);
  }
  ctx.body = {product: mapProduct(product)};
};
