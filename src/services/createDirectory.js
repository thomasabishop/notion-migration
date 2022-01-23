const fs = require("fs");
module.exports = function (directoryPath) {
  return !fs.existsSync(directoryPath)
    ? fs.mkdirSync(directoryPath)
    : console.warn(`Directory /${directoryPath} already exists`);
};
