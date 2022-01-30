const fs = require('fs')
exports.createDir = function (path) {
  return !fs.existsSync(path)
    ? fs.mkdirSync(path)
    : console.warn(`Directory /${path} already exists`)
}

exports.deleteDir = function (path) {
  if (fs.existsSync(path)) {
    fs.rmSync(path, { recursive: true, force: true })
    console.log('Old directory purged!')
  } else {
    console.warn('No directory to purge. Creating fresh directory...')
  }
  return
}
