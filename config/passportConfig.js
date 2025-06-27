// const passport = require("passport");
// const User = require("../models/User");

// // Use passport-local-mongoose strategy
// passport.use(User.createStrategy());

// // Serialize user to session
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// // Deserialize user from session
// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (error) {
//     done(error, null);
//   }
// });

// module.exports = passport;
