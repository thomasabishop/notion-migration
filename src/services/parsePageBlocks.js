const {
  parseHeading,
  parseCallout,
  parseBlockEquation,
  parseImage,
} = require('./parsers')

module.exports = function (pageBlocks) {
  let parsed = []
  // console.log(pageBlocks)
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
      case 'callout':
        parsed.push(parseCallout(block))
        break
      case 'equation':
        // console.log(block)
        parsed.push(parseBlockEquation(block))
        break
      case 'image':
        parsed.push(parseImage(block))
        break
    }
  }

  return parsed
}
