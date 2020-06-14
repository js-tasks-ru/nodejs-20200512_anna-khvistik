const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    async function(email, password, done) {
      const userByEmail = await User.findOne({email});
      if (!userByEmail) {
        done(null, false, 'Нет такого пользователя');
        return;
      }

      const isPasswordCorrect = await userByEmail.checkPassword(password);
      if (!isPasswordCorrect) {
        done(null, false, 'Неверный пароль');
        return;
      }

      done(null, userByEmail);
    }
);
