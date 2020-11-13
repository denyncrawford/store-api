const packageJSON = require('../package.json')

exports.apiVersion = () => {
  return {
    apiVersion: packageJSON.version,
    graviton: {
      devVersion: '2.0.99',
      betaVersion: '2.0.92',
      stableVersion: '0.0.0',
    },
  }
}
