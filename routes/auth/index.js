const router = require('express').Router()
const passport = require('passport')
const GitHubStrategy = require('passport-github2').Strategy
const HeaderAPIKeyStrategy = require('passport-headerapikey').HeaderAPIKeyStrategy
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET
const { Connection } = require('../../models/database')
const { formatProfile, isAdmin } = require('../../models/users')

// Connector

const connect = async () => {
  await Connection.connectToMongo()
  const database = Connection.db
  return (users = database.collection('users'))
}

// Github STRATEGY

passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.HOST}/auth/github/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      const users = await connect()
      let user = await users.findOne({ id: profile.id })
      if (Boolean(user)) return done(null, user)
      let insertion = formatProfile(profile)
      insertion.admin = await isAdmin(profile.username)
      user = await users.insertOne(insertion)
      let err = !Boolean(user)
      return done(err, insertion)
    }
  )
)

// APIKEY STRATEGY

passport.use(
  new HeaderAPIKeyStrategy({ header: 'Authorization', prefix: 'Api-Key ' }, true, async (apikey, done) => {
    const users = await connect()
    let user = await users.findOne({ api_key: apikey })
    if (!Boolean(user)) {
      return done(null, false)
    }
    return done(null, user)
  })
)

// Endpoints

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }))

router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/auth/login' }), (req, res) => {
  // Successful authentication, redirect home.
  res.redirect('/')
})

router.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/')
})

// Request status

const statusMessages = {
  401: {
    code: 401,
    status: 'unauthrized',
    message: 'Unauthorized request, please provide a valid API KEY to access this private endpoint.',
  },
}

router.get('/unauthorized', (req, res) => {
  res.status(401).json(statusMessages[401])
})

module.exports = router
