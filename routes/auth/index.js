const router = require('express').Router()
const passport = require('passport')
const GitHubStrategy = require('passport-github2').Strategy;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const { Connection } = require('../../models/database')
const { formatProfile } = require('../../models/users')

passport.use(new GitHubStrategy({
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: "http://localhost:2035/auth/github/callback"
}, async (accessToken, refreshToken, profile, done) => {
  await Connection.connectToMongo()
  const database = Connection.db;
  const users = database.collection('users')
  let user = await users.findOne({id: profile.id});
  if (Boolean(user)) return done(null, user);
  let insertion = formatProfile(profile);
  user = await users.insertOne(insertion);
  let err = !Boolean(user)
  return done(err, insertion);
}
));

// Endpoints

router.get('/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }));

router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/auth/login' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

module.exports = router;