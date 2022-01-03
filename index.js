const fs = require("fs");
const notionApiKey = require("./auth/notionApiKey");
const databaseUniqueId = require("./auth/databaseId");
const { Client } = require("@notionhq/client");

const notion = new Client({ auth: notionApiKey });

async function getPagesForDatabase(dbId) {
  let res = await notion.databases.query({ database_id: dbId });
  return res.results;
}

async function getPageContents(pageId) {
  const response = await notion.blocks.children.list({
    block_id: pageId,
  });
  console.log(response.results[1].paragraph.text);
  console.log(response.results[1].paragraph.text[0].plain_text);
  console.log(response.results[1].paragraph.text[0].annotations);
}

async function exportPages() {
  let pages = await getPagesForDatabase(databaseUniqueId);
  console.log(pages);
}

// exportPages();
getPageContents("1c9414e0-0aae-4e23-963a-207a66dd06fe");

/**
 *
 * @param {*} dirPath : directory to be created
 * @description create new dir or overwrite if stale
 */

function createDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rm(dirPath, { recursive: true }, (err) => {
      if (err) {
        throw err;
      }
    });
  } else {
    fs.mkdirSync(dirPath);
  }
}

// createDirectory("test-dir");

//getPagesForDatabase(databaseUniqueId);

// (async () => {
//   const databaseId = dbId;
//   const response = await notion.databases.query({ database_id: databaseId });
//   console.log(response);
// })();

// async function getDatabase
