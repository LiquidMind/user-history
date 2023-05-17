const fs = require("fs");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const { SCOPES, TOKEN_DIR, TOKEN_PATH } = require("./config");
const { getPuppeteerCode } = require("./puppeteer");

function refreshAccessToken(oauth2Client) {
  return new Promise((resolve, reject) => {
    oauth2Client.refreshAccessToken((err, token) => {
      if (err) {
        reject(err);
      } else {
        oauth2Client.credentials = token;
        storeToken(token);
        resolve(oauth2Client);
      }
    });
  });
}

async function getNewToken(oauth2Client, callback) {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url: ", authUrl);

  try {
    const encodedCode = await getPuppeteerCode(authUrl);
    if (encodedCode) {
      const code = decodeURIComponent(encodedCode);
      console.log(`CODE: ${code}`);

      oauth2Client.getToken(code, function (err, token) {
        if (err) {
          console.log("Error while trying to retrieve access token", err);
          return;
        }
        oauth2Client.credentials = token;
        storeToken(token);
        callback(oauth2Client);
      });
    } else {
      console.log("Could not retrieve code from Puppeteer");
    }
  } catch (err) {
    console.log("Error during token retrieval", err);
  }
}

function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != "EEXIST") {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
    if (err) throw err;
    console.log("Token stored to " + TOKEN_PATH);
  });
  console.log("Token stored to " + TOKEN_PATH);
}

module.exports = { getNewToken, storeToken, refreshAccessToken };
