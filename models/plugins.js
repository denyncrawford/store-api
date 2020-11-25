let yup = require('yup')

// Get the plugin's last version.

exports.getLastVersion = (releases) => {
  const currentVersion = releases
    .filter(({ version }) => !version.endsWith('.pre') && !version.includes('rc'))
    .reduce((a, b) =>
      0 < a.version.localeCompare(b.version, undefined, { numeric: true, sensitivity: 'base' }) ? a : b
    )
  return currentVersion.version
}

// Get the pointed release

exports.getRelase = (releases, release) => {
  let rt = releases.filter((r) => {
    return r.version == release
  })
  if (rt.length == 0) return { url: null }
  return rt[0]
}

// Validating plugin insertion.

let schema = yup.object().shape({
  name: yup.string().required(),
  id: yup.string().trim().strict(true).required(),
  author: yup.string().required(),
  description: yup.string().required(),
  repository: yup.string().url().required(),
  piblishedOn: yup.date().default(function () {
    return new Date()
  }),
  releases: yup
    .array()
    .of(
      yup.object().shape({
        version: yup.string().required(),
        minTarget: yup.string(),
        target: yup.number().positive().integer().required(),
        url: yup.string().url().required(),
      })
    )
    .min(1)
    .required(),
})

exports.validatePlugin = (payload) => {
  if (typeof payload !== 'object') return false
  return schema.isValid(payload)
}
