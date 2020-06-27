const uuid = require('uuid/v4');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const verificationToken = uuid();
  const {email, displayName, password} = ctx.request.body;

  const user = new User({verificationToken, email, displayName});
  await user.setPassword(password);
  await user.save();

  await sendMail({
    subject: 'Подтвердите почту',
    to: email,
    template: 'confirmation',
    locals: {token: verificationToken},
  });

  ctx.body = {status: 'ok'};
};

module.exports.confirm = async (ctx, next) => {
  const {verificationToken} = ctx.request.body;
  const user = await User.findOne({verificationToken});

  if (!user) {
    ctx.status = 400;
    ctx.body = {error: 'Ссылка подтверждения недействительна или устарела'};
    return;
  }
  user.verificationToken = undefined;
  await user.save();
  const token = uuid();
  ctx.body = {token};
};
