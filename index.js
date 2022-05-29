const fs = require("fs");
const { Client } = require("@notionhq/client");

const notionApiKey = require("./src/api/auth/notionApiKey");
const databaseUniqueId = require("./src/api/auth/databaseId");
const { createDir, deleteDir } = require("./src/services/io");
const globals = require("./src/globals");
const getPageContents = require("./src/api/getPageContents");
const generateMdPage = require("./src/services/generateMdPage");
const createIndex = require("./src/services/createIndex");
const { spaceToUnderscore } = require("./src/utils/spaceToUnderscore");
const createFrontmatter = require("./src/services/createFrontmatter");
const parsers = require("./src/services/parsers");

async function migrate() {
  console.log(module);
  const notion = new Client({ auth: notionApiKey });
  global.INDEX = await createIndex(databaseUniqueId, notion);
  global.TARGET_DIR = "migrated_project"; // TODO: handle from user input
  deleteDir(`${global.TARGET_DIR}`);
  createDir(`${global.TARGET_DIR}`);
  createDir(`${global.TARGET_DIR}/img`);
  for (const page of global.INDEX) {
    getPageContents(page.pageId, notion).then((blocks) =>
      fs.writeFileSync(
        global.TARGET_DIR + "/" + spaceToUnderscore(page.pageTitle) + ".md",
        generateMdPage(blocks.results).join("\n")
      )
    );
  }
}
migrate();
