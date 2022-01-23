module.exports = async function (databaseUniqueId, notionClient) {
  let resp = await notionClient.databases.query({
    database_id: databaseUniqueId,
  });
  return resp.results.map((page) => page.id);
};
