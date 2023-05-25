const fs = require("fs");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const { SCOPES, TOKEN_DIR } = require("./config");
const { getNewToken } = require("./token");
const crypto = require("crypto");
require("dotenv").config();
const { SECRETPAS } = process.env;
const { db } = require("../../model/dbConnection");

fs.readFile(
  "./src/autoTokenCreateAndUpdate/client_secret.json",
  (err, content) => {
    if (err) {
      console.error("Error loading client secret file:", err);
    } else {
      try {
        const oauth2Client = authorize(JSON.parse(content));
        setInterval(() => {
          checkTokens(oauth2Client);
        }, 5000);
      } catch (parseErr) {
        console.error("Error parsing client secret file:", parseErr);
      }
    }
  }
);

function authorize(credentials) {
  const clientSecret = credentials.installed.client_secret;
  const clientId = credentials.installed.client_id;
  const redirectUrl = credentials.installed.redirect_uris[0];
  const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

  return oauth2Client;
}

function checkTokens(oauth2Client) {
  const sqlQuery = `SELECT google_email, google_password, historyUpdatedAt
FROM google_users
WHERE saveToken IN ("proces", "incorrectData")
ORDER BY historyUpdatedAt ASC;
`;

  db.query(sqlQuery, (err, result) => {
    if (err) {
      console.error("Error executing SQL query:", err);
    } else {
      result.forEach((resObj) => {
        processEmailPassword(resObj, oauth2Client);
      });
    }
  });
}

function processEmailPassword(resObj, oauth2Client) {
  const email = resObj.google_email;
  let password = resObj.google_password;
  const TOKEN_PATH = TOKEN_DIR + `${email}.json`;

  if (password === "noPassword") {
    return;
  }

  fs.readFile(TOKEN_PATH, (err) => {
    if (err) {
      try {
        decryptPlaylist(email, password.trim(), oauth2Client);
      } catch (decryptErr) {
        console.error("Error decrypting playlist:", decryptErr);
      }
    }

    const updateQuery = `UPDATE google_users SET saveToken = "save" WHERE google_email = '${email}'`;

    db.query(updateQuery, (err, res) => {
      if (err) {
        console.error("Error updating saveToken:", err);
      }
      console.log("Token already exists. No action taken.");
    });
  });
}

function decryptPlaylist(email, encryptedText, oauth2Client) {
  const [ivText, encryptedTextOnly, tagText] = encryptedText.split(":");
  const iv = Buffer.from(ivText, "hex");
  const key = crypto.scryptSync(SECRETPAS, "salt", 32);
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);

  decipher.setAuthTag(Buffer.from(tagText, "hex"));

  let decrypted = decipher.update(encryptedTextOnly, "hex", "utf8");
  decrypted += decipher.final("utf8");
  console.log(email, decrypted);

  getNewToken(
    oauth2Client,
    (auth) => {
      console.log("Authorization complete. Token:", auth.credentials);
      const updateQuery = `UPDATE google_users SET saveToken = "save" WHERE google_email = '${email}'`;

      db.query(updateQuery, (err, res) => {
        if (err) {
          console.error("Error updating saveToken:", err);
        }
      });
    },
    email,
    decrypted
  );
}

module.exports = { authorize };
