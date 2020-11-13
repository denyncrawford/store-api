const router = require('express').Router()
const passport = require('passport')
const GitHubStrategy = require('passport-github2').Strategy;
const HeaderAPIKeyStrategy = require('passport-headerapikey').HeaderAPIKeyStrategy
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const { Connection } = require('../../models/database')
const { formatProfile } = require('../../models/users')

// Github STRATEGY

passport.use(new GitHubStrategy({
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: `${process.env.HOST}/auth/github/callback`
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

// APIKEY STRATEGY 

passport.use(new HeaderAPIKeyStrategy(
  { header: 'Authorization', prefix: 'Api-Key ' },
  false,
  async (apikey, done) => {
    await Connection.connectToMongo()
    const database = Connection.db;
    const users = database.collection('users')
    let user = await users.findOne({api_key: apikey});
    if (!user || !user.length) { return done(null, false); }
    return done(null, user);
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