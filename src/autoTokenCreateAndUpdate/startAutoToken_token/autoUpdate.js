const fs = require("fs");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const tokenClient = require("./createAndUpdate/tokenClient");
const readline = require("readline");
const { db } = require("../../model/dbConnection");

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
  "/Documents/ProjectYoutube/Archive/usersTokens/";
let TOKEN_PATH = ""; // Объявление переменной TOKEN_PATH

const processUsers = async () => {
  let users = [];
  const getUserData = () => {
    db.query(
      `SELECT id, google_email FROM google_users WHERE saveToken = "save" ORDER BY historyUpdatedAt ASC`,
      (err, result) => {
        if (err) {
          console.error("Error executing SQL query:", err);
        } else {
          users = result;
        }
      }
    );
  };

  getUserData();

  setInterval(() => {
    getUserData();
  }, 20 * 1000);

  const processUser = (user, index) => {
    if (!user) {
      setTimeout(() => {
        processUser(users[0], 0);
      }, 20 * 1000);
      return;
    }

    const resObj = user;
    const resEmail = Object.values(resObj)[1];
    const resId = Object.values(resObj)[0];

    TOKEN_PATH = TOKEN_DIR + `${resEmail}.json`; // Присваивание значения переменной TOKEN_PATH

    console.log(TOKEN_PATH);

    fs.readFile(
      "./src/autoTokenCreateAndUpdate/client_secret.json",
      (err, content) => {
        if (err) {
          console.log("Error loading client secret file: " + err);
          return;
        }
        const credentials = JSON.parse(content);
        const clientSecret = credentials.installed.client_secret;
        const clientId = credentials.installed.client_id;
        const redirectUrl = credentials.installed.redirect_uris[0];
        const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

        fs.readFile(TOKEN_PATH, (err, token) => {
          if (err) {
            getNewToken(oauth2Client, (oauth2Client) => {
              console.log(
                "Authorization complete. Token:",
                oauth2Client.credentials
              );
              tokenClient(oauth2Client.credentials, resId);
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
                tokenClient(oauth2Client.credentials, resId);
              });
            } else {
              tokenClient(oauth2Client.credentials, resId);
            }
          }
        });
      }
    );

    setTimeout(() => {
      processUser(users[index + 1], index + 1);
    }, 20 * 1000);
  };

  processUser(users[0], 0);
};

const getNewToken = (oauth2Client, callback) => {
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
};

const storeToken = (token) => {
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
};

processUsers();
