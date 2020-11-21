const { v1: uuidv1 } = require('uuid')
const fetch = require('node-fetch')
// Get all plugins

exports.formatProfile = (profile) => {
  let data = profile._json
  return {
    name: profile.displayName,
    email: data.email,
    username: profile.username,
    api_key: uuidv1(),
    id: profile.id,
    picture: data.avatar_url,
  }
}

exports.isAdmin = async (username) => {
  let contributors = await fetch(`${process.env.REPO_TARGET_API}/contributors`)
  contributors = await contributors.json()
  let admin = contributors.find((col) => col.login === username)
  if (Boolean(admin)) return true
  return false
}
