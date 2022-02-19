const fs = require('fs')
const { Client } = require('@notionhq/client')

const notionApiKey = require('./src/api/auth/notionApiKey')
const databaseUniqueId = require('./src/api/auth/databaseId')
const { createDir, deleteDir } = require('./src/services/io')
const globals = require('./src/globals')
const getPageIds = require('./src/api/getPageIds')
const getPageContents = require('./src/api/getPageContents')
const parsePageBlocks = require('./src/services/parsePageBlocks')
const { parseTextBlock } = require('./src/services/parsers')
async function migrate() {
  deleteDir(`${globals.MAIN_DIR}`)
  createDir(`${globals.MAIN_DIR}`)
  createDir(`${globals.MAIN_DIR}/img`)
  const notion = new Client({ auth: notionApiKey })
  let pageIds = await getPageIds(databaseUniqueId, notion)
  let firstPage = await getPageContents(pageIds[0], notion)
  let firstPageConcat = parsePageBlocks(firstPage.results).join('\n')
  fs.writeFileSync(`${globals.MAIN_DIR}/test-output.md`, firstPageConcat)
}

migrate()
