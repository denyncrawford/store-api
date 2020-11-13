const { v1: uuidv1 } = require('uuid')
// Get all plugins


exports.formatProfile = (profile) => {
  let data = profile._json
  return {
    name: profile.displayName,
    email: data.email,
    username: profile.username,
    api_key: uuidv1(),
    id: profile.id,
    picture: data.avatar_url
  }
}
