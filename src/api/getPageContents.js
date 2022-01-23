/**
 * Each page element is returned as a database 'block'.
 * This function returns the blocks for a single page
 * as an array of block objects.
 */

module.exports = async function (pageId, notionClient) {
  let blocks = await notionClient.blocks.children.list({
    block_id: pageId,
  })
  return blocks
}
