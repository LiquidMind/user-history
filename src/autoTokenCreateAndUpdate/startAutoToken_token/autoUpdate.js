const fs = require("fs");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const tokenClient = require("./createAndUpdate/tokenClient");
const readline = require("readline");

const SCOPES = [
  "https://www.googleapis.com/auth/youtube",
  "https://www.googleapis.com/auth/youtube.channel-memberships.creator",
  "https://www.googleapis.com/auth/youtube.force-ssl",
  "https://www.googleapis.com/auth/youtube.readonly",
  "https://www.googleapis.com/auth/youtube.upload",
  "https://www.googleapis.com/auth/youtubepartner",
  "https://www.googleapis.com/auth/youtubepartner-channel-audit",
];
const TOKEN_DIR =
  (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) +
  "/.credentials/";
const TOKEN_PATH = TOKEN_DIR + "max190716@gmail.com.json";

function getNewToken(oauth2Client, callback) {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url: ", authUrl);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Enter the code from the authorization page: ", (code) => {
    rl.close();

    oauth2Client.getToken(code, (err, token) => {
      if (err) {
        console.error("Error while trying to retrieve access token", err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code !== "EEXIST") {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
    if (err) throw err;
    console.log("Token stored to " + TOKEN_PATH);
  });
  console.log("Token stored to " + TOKEN_PATH);
}

fs.readFile(
  "./src/autoTokenCreateAndUpdate/client_secret.json",
  (err, content) => {
    if (err) {
      console.log("Error loading client secret file: " + err);
      return;
    }
    authorize(JSON.parse(content));
  }
);

function authorize(credentials) {
  const clientSecret = credentials.installed.client_secret;
  const clientId = credentials.installed.client_id;
  const redirectUrl = credentials.installed.redirect_uris[0];
  const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) {
      getNewToken(oauth2Client, (auth) => {
        console.log("Authorization complete. Token:", auth.credentials);
        tokenClient(oauth2Client.credentials);
      });
    } else {
      oauth2Client.credentials = JSON.parse(token);
      if (oauth2Client.isTokenExpiring()) {
        oauth2Client.refreshAccessToken((err, refreshedToken) => {
          if (err) {
            console.error("Error while refreshing access token", err);
            return;
          }
          oauth2Client.credentials = refreshedToken;
          storeToken(refreshedToken);
          tokenClient(oauth2Client.credentials);
        });
      } else {
        tokenClient(oauth2Client.credentials);
      }
    }
  });
}
