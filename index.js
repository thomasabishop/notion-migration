const fs = require('fs')
const { Client } = require('@notionhq/client')

const notionApiKey = require('./src/api/auth/notionApiKey')
const databaseUniqueId = require('./src/api/auth/databaseId')
const getPageIds = require('./src/api/getPageIds')
const getPageContents = require('./src/api/getPageContents')
const parsePageBlocks = require('./src/services/parsePageBlocks')

async function migrate() {
  const mainDirectory = 'migrated_project'
  const notion = new Client({ auth: notionApiKey })
  let pageIds = await getPageIds(databaseUniqueId, notion)
  let firstPage = await getPageContents(pageIds[0], notion)
  // console.log(firstPage.results)
  console.log(parsePageBlocks(firstPage.results))
}

migrate()
