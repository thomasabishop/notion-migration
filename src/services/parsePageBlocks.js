const {
  parseHeading,
  parseCallout,
  parseBlockEquation,
  parseImage,
  parseCodeBlock,
  parseParagraph,
  parseBookmark,
  parseBulletedList,
} = require('./parsers')

module.exports = function (pageBlocks) {
  let parsed = []
  for (const block of pageBlocks) {
    switch (block.type) {
      case 'heading_1':
        parsed.push(parseHeading(block))
        break
      case 'heading_2':
        parsed.push(parseHeading(block))
        break
      case 'heading_3':
        parsed.push(parseHeading(block))
        break
      case 'paragraph':
        parsed.push(parseParagraph(block))
        break
      case 'bulleted_list_item':
        parsed.push(parseBulletedList(block))
        break
      // case 'numbered_list_item':
      //   parsed.push(parseNumberedList(block))
      //   break
      case 'callout':
        parsed.push(parseCallout(block))
        break
      case 'equation':
        parsed.push(parseBlockEquation(block))
        break
      case 'image':
        parsed.push(parseImage(block))
        break
      case 'code':
        parsed.push(parseCodeBlock(block))
        break
      case 'bookmark':
        parsed.push(parseBookmark(block))
    }
  }

  return parsed
}
