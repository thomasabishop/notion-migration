const fs = require("fs");
const writePath = "new-json.json";

class Theme {
  name = "Alien Blood";
  type = "dark";
  colors = undefined;
  tokenColors = undefined;
}

class TokenColor {
  name = "";
  scope = [];
  settings = {};
  constructor(scopeKey, color) {
    this.scope.push(scopeKey);
    this.settings.foreground = color;
  }
}

const testTheme = new Theme();
const test = new TokenColor("storage.type.function", "#2f7e25");
// console.log(test);

let inputJson = fs.readFileSync("source.json");
let data = JSON.parse(inputJson);
// console.log(data);

function generateNewJson(input) {
  let alienblood = new Theme();
  alienblood.colors = input.colors;
  let newTokenColors = [];
  let tokens = input.tokenColors;
  for (const token of tokens) {
    for (const scope of token.scope) {
      newTokenColors.push(new TokenColor(scope, token.name));
    }
  }
  alienblood.tokenColors = newTokenColors;
  if (fs.existsSync(writePath)) {
    fs.unlinkSync(writePath);
    fs.writeFileSync(writePath, JSON.stringify(alienblood));
  } else {
    fs.writeFileSync(writePath, JSON.stringify(alienblood));
  }
}

generateNewJson(data);
