class PageMetadata {
  constructor(props) {
    this.databaseId = props.databaseId
    this.pageId = props.pageId
    this.pageIdStripped = this.pageId.replace(/-/g, '')
    this.pageTitle = props.pageTitle
    this.publicUrl = props.publicUrl
    // this.encodedUrl = Buffer.from(this.publicUrl).toString('base64')
    this.tags = props.tags
  }
}

module.exports = PageMetadata
