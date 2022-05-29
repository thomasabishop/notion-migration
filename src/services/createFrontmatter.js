module.exports = function (tags) {
  let parsed = tags.map((tag) => `#${tag}`)
  return `--- \n tags: [${parsed.join()}]\n---\n\n`
}
