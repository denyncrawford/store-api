const express = require('express')
const createRateLimit = require('express-rate-limit')
const session = require("express-session");
const passport = require('passport')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const enableWs = require('express-ws')
const app = express();
if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const MongoStore = require('connect-mongo')(session);
const { Connection } = require('./models/database')

const appLimit = createRateLimit({
  windowMs: 50000,
  max: 7,
  message: {
    message: 'Too many requests.',
  },
})

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


enableWs(app)
app.use(cors())
app.use(appLimit)
app.use(morgan('dev'))
app.use(session({ 
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({ 
      url:  `mongodb+srv://crawford:${process.env.DATABASE_PASSWORD}@cluster0.ptsmt.mongodb.net/graviton?retryWrites=true&w=majority`,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true }
    }) 
  }));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(require('./routes/api'));
app.use('/api', require('./routes/api'))
app.use('/auth', require('./routes/auth'))

app.listen(process.env.PORT || 2035, () => console.log(`App listening on port ${process.env.PORT || 2035}`))

module.exports = app
