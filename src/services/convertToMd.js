/**
 *
 * @param {string} tokenType Annotation style returned from API
 * @param {string} string The string to be converted to markdown in this style
 * @returns String in markdown
 */

exports.convertToMd = (tokenType, string) => {
  let markedDown
  // Unary markdown properties:
  switch (tokenType) {
    case 'heading_1':
      markedDown = `# ${string}<br />`
      break
    case 'heading_2':
      markedDown = `## ${string}<br />`
      break
    case 'heading_3':
      markedDown = `### ${string}<br />`
      break
    case 'bold':
      markedDown = `**${string}**`
      break
    case 'italic':
      markedDown = `_${string}_`
      break
    case 'callout':
      markedDown = `>${string}`
      break
    case 'equation':
      markedDown = `$${string}$`
      break
    case 'code':
      markedDown = `\`${string}\``
    default:
      markedDown = `${string}`
  }
  return markedDown
}
/**
 * Recursively apply the above conversion for an array of token types
 */
exports.recurseConvertToMd = (tokenArr, str) => {
  str = this.convertToMd(tokenArr[0], str)
  tokenArr.shift()
  if (tokenArr.length) {
    return this.recurseConvertToMd(tokenArr, str)
  }
  return str
}
