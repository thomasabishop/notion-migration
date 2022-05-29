const PageMetadata = require('./PageMetadata')

module.exports = async function (databaseUniqueId, notionClient) {
  let metadata = []
  let pages = await notionClient.databases.query({
    database_id: databaseUniqueId,
  })

  pages.results.map((page) => {
    console.log(page)
    metadata.push(
      new PageMetadata({
        databaseId: page?.parent?.database_id,
        pageId: page?.id,
        pageTitle: page?.properties.Page.title[0].plain_text,
        publicUrl: page?.url,
        tags: (page?.properties.Tags[page.properties.Tags.type]).map(
          (x) => x.name
        ),
      })
    )
  })

  return metadata
}
