const crypto = require('crypto')
const globals = require('../globals')
const getImage = require('../api/getImage')
const { getKeyByValue } = require('../utils/getKeyByValue')
const { convertInlineMd, recurseConvertInlineMd } = require('./convertInlineMd')

exports.parseParagraph = (block) => {
  let parsed = []
  let subBlocks = block[block.type].text
  const isLink = (block) => block.href !== null
  subBlocks.map((sb) => {
    //  console.log(sb.annotations)
    if (!isLink(sb)) {
      // sb.annotations.color !== 'default' ? console.log(sb.plain_text) : null
      mdStyles = getKeyByValue(sb.annotations, true)
      parsed.push(recurseConvertInlineMd(mdStyles, sb.plain_text.trim()))
    } else {
      parsed.push(this.parseLink(sb.plain_text.trim(), sb.href))
    }
  })
  return parsed.join(' ')
}

exports.parseLink = (anchorText, url, asBlockLevel) => {
  return asBlockLevel ? `\n[${anchorText}](${url})` : `[${anchorText}](${url})`
}

exports.parseBookmark = (block) => {
  // Add caption handler
  return this.parseLink(block[block.type].url, block[block.type].url, true)
}

exports.parseHeading = (block) => {
  let headingContents = block[block.type].text[0].plain_text
  return convertInlineMd(block.type, headingContents.trim())
}

exports.parseCallout = (block) => {
  let callout = ['>']
  // Return content array for the given block-type:
  let subBlocks = block[block.type].text
  subBlocks.map((sb) => {
    mdStyles = getKeyByValue(sb.annotations, true)
    callout.push(recurseConvertInlineMd(mdStyles, sb.plain_text.trim()))
  })
  return callout.join(' ')
}

exports.parseBlockEquation = (block) => {
  return `$$ ${block[block.type].expression} $$`
}

exports.parseCodeBlock = (block) => {
  // TODO: Add handling for captions
  const codeObject = block[block.type]
  const hasCaption = codeObject.caption.length > 0
  let code = codeObject.text[0].plain_text.trim()
  const lang = codeObject.language
  return ` \`\`\`${lang} \n ${code} \n  \`\`\` `
}

exports.parseImage = (block) => {
  // TODO: Add handling for captions
  const fileExtensions = new Map([
    ['.png?', '.png'],
    ['.jpg?', '.jpg'],
    ['.jpeg?', '.jpg'],
    ['.svg?', '.svg'],
    ['.gif?', '.gif'],
  ])
  const rxFileType = /\.\w{3,4}($|\?)/
  // Individuate image url:
  const imgUrl = block[block.type].file.url
  // console.log(block[block.type].caption[0]?.plain_text)
  // If image extension exists in map:
  if (fileExtensions.has(rxFileType.exec(imgUrl)[0])) {
    // Match file extension
    const imgExtension = fileExtensions.get(rxFileType.exec(imgUrl)[0])

    // Create hash of URL to ensure unique img filename
    const hashedImgName = crypto.createHash('md5').update(imgUrl).digest('hex')
    // Create local file ref
    const localFileName =
      globals.MAIN_DIR + '/img/' + hashedImgName + imgExtension

    // Retrieve image from Notion database and write to image directory with local file ref
    getImage(imgUrl, localFileName)
    return '![](img/' + hashedImgName + imgExtension + ')'
  }
}
