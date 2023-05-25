const fs = require("fs");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const { SCOPES, TOKEN_DIR, TOKEN_PATH } = require("./config");
const { getPuppeteerCode } = require("./puppeteer");
const { db } = require("../../model/dbConnection");

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

async function getNewToken(oauth2Client, callback, email, password) {
  try {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
    });
    console.log("Authorize this app by visiting this url: ", authUrl);

    const encodedCode = await getPuppeteerCode(authUrl, email, password);

    if (encodedCode) {
      const code = decodeURIComponent(encodedCode);
      console.log(`CODE: ${code}`);

      oauth2Client.getToken(code, function (err, token) {
        if (err) {
          console.log("Error while trying to retrieve access token", err);
        } else {
          oauth2Client.credentials = token;
          storeToken(token, email);
          callback(oauth2Client);
        }
      });
    } else {
      console.log("Could not retrieve code from Puppeteer");
      // Продовжуємо функцію навіть без коду
      callback(oauth2Client);
    }
  } catch (err) {
    db.query(
      `UPDATE google_users SET saveToken = "incorrectData" WHERE google_email = '${email}'`,
      (err, res) => {
        if (err) {
          console.error("Error updating saveToken:", err);
        }
      }
    );
    console.log("Error during token retrieval", err);
  }
}

function storeToken(token, tokenName) {
  const a = TOKEN_DIR + `${tokenName}.json`;
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != "EEXIST") {
      throw err;
    }
  }
  fs.writeFile(a, JSON.stringify(token), (err) => {
    if (err) throw err;
    console.log("Token stored to " + a);
  });
  console.log("Token stored to " + a);
}

module.exports = { getNewToken, storeToken, refreshAccessToken };
