const crypto = require('crypto')
const globals = require('../globals')
const getImage = require('../api/getImage')
const { getKeyByValue } = require('../utils/getKeyByValue')
const { convertInlineMd, recurseConvertInlineMd } = require('./convertInlineMd')

// Private functions
const parseLink = (anchorText, url, asBlockLevel) => {
  return asBlockLevel ? `\n[${anchorText}](${url})` : `[${anchorText}](${url})`
}

const parseCaption = (caption) => {
  let processed = []
  caption.map((substring) => {
    let styles = getKeyByValue(substring.annotations, true)
    let raw = substring.plain_text.trim()
    switch (substring.type) {
      case 'equation':
        processed.push(this.parseEquation(raw))
        break
      case 'text':
        substring.href
          ? processed.push(parseLink(raw, substring.href))
          : processed.push(recurseConvertInlineMd(styles, raw))
    }
  })
  processed = processed.join(' ')
  return `<p style="font-size: 14px">${processed}</p>`
}

// Public functions

exports.parseBulletedList = (block) => {
  let processed = []
  const subBlocks = block[block.type].text
  subBlocks.map((sb) => {
    let styles = getKeyByValue(sb.annotations, true)
    let raw = sb.plain_text.trim()
    switch (sb.type) {
      case 'equation':
        processed.push(this.parseEquation(raw))
        break
      case 'text':
        sb.href
          ? processed.push(parseLink(raw, sb.href))
          : processed.push(recurseConvertInlineMd(styles, raw))
    }
  })
  processed = processed.join(' ')
  return `* ${processed}<br />`
}

exports.parseHeading = (block) => {
  let processed = []
  const subBlocks = block[block.type].text
  subBlocks.map((sb) => {
    let styles = getKeyByValue(sb.annotations, true)
    let raw = sb.plain_text.trim()
    switch (sb.type) {
      case 'equation':
        processed.push(this.parseEquation(raw))
        break
      case 'text':
        sb.href
          ? processed.push(parseLink(raw, sb.href))
          : processed.push(recurseConvertInlineMd(styles, raw))
    }
  })

  processed = processed.join(' ')

  switch (block.type) {
    case 'heading_1':
      processed = `# ${processed}<br />`
      break
    case 'heading_2':
      processed = `## ${processed}<br />`
      break
    case 'heading_3':
      processed = `### ${processed}<br />`
      break
  }
  return processed
}

exports.parseParagraph = (block) => {
  let processed = []
  let subBlocks = block[block.type].text
  subBlocks.map((sb) => {
    let styles = [
      sb.type === 'equation' && sb.type,
      ...getKeyByValue(sb.annotations, true),
    ]
    let raw = sb.plain_text.trim()
    sb.href
      ? processed.push(parseLink(raw, sb.href))
      : processed.push(recurseConvertInlineMd(styles, raw))
  })
  processed.push('<br />')
  return processed.join(' ')
}

exports.parseBookmark = (block) => {
  let processed = []
  let bookmark = block[block.type]
  if (bookmark.caption.length) {
    processed[1] = parseCaption(bookmark.caption)
  }

  processed[0] = parseLink(block[block.type].url, block[block.type].url, true)
  return processed.join(' ')
}

exports.parseCallout = (block) => {
  let callout = ['>']
  // Return content array for the  block-type:
  let subBlocks = block[block.type].text
  subBlocks.map((sb) => {
    mdStyles = getKeyByValue(sb.annotations, true)
    callout.push(recurseConvertInlineMd(mdStyles, sb.plain_text.trim()))
  })
  callout.push('\n')
  return callout.join(' ')
}

exports.parseEquation = (block) => `$${block}$`
exports.parseBlockEquation = (block) => {
  return `$$ ${block[block.type].expression} $$`
}

exports.parseCodeBlock = (block) => {
  let processed = []
  const codeObject = block[block.type]
  if (codeObject.caption.length) {
    processed[1] = parseCaption(codeObject.caption)
  }
  let code = codeObject.text[0].plain_text.trim()
  const lang = codeObject.language
  processed[0] = ` \`\`\`${lang} \n ${code} \n  \`\`\` \n`
  processed.join(' ')
  return processed
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
  const imgBlock = []
  const img = block[block.type]
  const imgUrl = img.file.url
  if (img.caption.length) {
    imgBlock[1] = parseCaption(img.caption)
  }

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
    imgBlock[0] = '![](img/' + hashedImgName + imgExtension + ')'
    return imgBlock.join(' ')
  }
}
