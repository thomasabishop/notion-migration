const { getKeyByValue } = require('../utils/getKeyByValue')
const { convertToMd, recurseConvertToMd } = require('./convertToMd')

exports.parseHeading = (block) => {
  // Individuate main content for given block:
  let headingContents = block[block.type].text[0].plain_text
  return convertToMd(block.type, headingContents)
}

exports.parseCallout = (block) => {
  let callout = ['>']
  // Return content array for the given block-type:
  let subBlocks = block[block.type].text
  subBlocks.map((sb) => {
    mdStyles = getKeyByValue(sb.annotations, true)
    callout.push(recurseConvertToMd(mdStyles, sb.plain_text))
  })
  return callout.join('')
}

exports.parseBlockEquation = (block) => {
  return `$$ ${block[block.type].expression} $$`
}

exports.parseImage = (block) => {
  const imageUrl = block[block.type].file.url
  console.log(imageUrl)
}
