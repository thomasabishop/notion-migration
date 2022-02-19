/**
 *
 * @param {string} tokenType Annotation style returned from API
 * @param {string} string The string to be converted to markdown in this style
 * @returns String in markdown
 */

exports.convertInlineMd = (tokenType, string) => {
  let markedDown
  // string.trim()
  switch (tokenType) {
    case 'bold':
      markedDown = `**${string}**`
      break
    case 'italic':
      markedDown = `_${string}_`
      break
    case 'strikethrough':
      markedDown = `~~${string}~~`
      break
    case 'callout':
      markedDown = `>${string}`
      break
    case 'equation':
      markedDown = `$${string}$`
      break
    case 'code':
      markedDown = `\`${string}\``
      break
    case 'underline':
      markedDown = `<u>${string}</u>`
      break
    default:
      markedDown = `${string}`
  }
  return markedDown
}
/**
 * Recursively apply the above conversion for an array of token types
 */
exports.recurseConvertInlineMd = (tokenArr, str) => {
  str = this.convertInlineMd(tokenArr[0], str)
  tokenArr.shift()
  if (tokenArr.length) {
    return this.recurseConvertInlineMd(tokenArr, str)
  }
  return str
}
