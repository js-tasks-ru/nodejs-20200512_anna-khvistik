const User = require('../../models/User');

module.exports = async function authenticate(
    strategy,
    email,
    displayName,
    done
) {
  if (!email) {
    done(null, false, 'Не указан email');
    return;
  }

  let user = await User.findOne({email});
  if (user) {
    done(null, user);
    return;
  }

  user = new User({displayName, email});

  user.save((err, savedUser)=>{
    done(err, savedUser);
  });
};
