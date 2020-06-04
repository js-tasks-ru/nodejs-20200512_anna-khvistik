const Category = require('../models/Category');

const mapSubCategory = ({title, _id}) => ({
  id: _id,
  title,
});

const mapCategory = ({title, subcategories, _id}) => ({
  id: _id,
  title,
  subcategories: subcategories.map(mapSubCategory),
});

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Category.find();
  ctx.body = {categories: categories.map(mapCategory)};
};
