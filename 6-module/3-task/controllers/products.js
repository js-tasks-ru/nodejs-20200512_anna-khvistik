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

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const {query} = ctx.request.query;
  const products = await Product.find({$text: {$search: query}});

  ctx.body = {products: products.map(mapProduct)};
};
