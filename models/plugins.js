
exports.getLastVersion = (releases) => {  
  const currentVersion = releases
  .filter(({ version }) => !version.endsWith('.pre') && !version.includes('rc'))
   .reduce((a, b) =>
        0 < a.version.localeCompare(b.version, undefined, { numeric: true, sensitivity: 'base' })
            ? a
            : b
    );
    return currentVersion.version
}

exports.getRelase = (releases, release) => {
  let rt = releases.filter(r => {
    return r.version == release
  })
  if (rt.length == 0) return {url: null}
  return rt[0]
}