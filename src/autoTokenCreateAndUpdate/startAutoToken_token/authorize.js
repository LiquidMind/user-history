const fs = require("fs");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const { SCOPES, TOKEN_DIR, TOKEN_PATH } = require("./config");
const { getNewToken } = require("./token");
const tokenClient = require("./createAndUpdate/tokenClient");
const { executeRequestWithAutoRetry } = require("./token");

fs.readFile(
  "./src/userPlayLists/client_secret.json",
  function processClientSecrets(err, content) {
    if (err) {
      console.log("Error loading client secret file: " + err);
      return;
    }
    authorize(JSON.parse(content));
  }
);

// Функція для перевірки, чи токен скоро застаріє.
function isTokenExpiring(token) {
  // Застарілий токен визначається як токен, який закінчується менше ніж за 5 хвилин.
  const EXPIRATION_WINDOW_IN_SECONDS = 300;
  const now = new Date().getTime();
  // expiry_date в токені задається у мілісекундах.
  return token.expiry_date - now <= EXPIRATION_WINDOW_IN_SECONDS * 1000;
}

function authorize(credentials) {
  const clientSecret = credentials.installed.client_secret;
  const clientId = credentials.installed.client_id;
  const redirectUrl = credentials.installed.redirect_uris[0];
  const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

  fs.readFile(TOKEN_PATH, function (err, token) {
    if (err) {
      // Якщо ми не можемо прочитати токен, ми отримуємо новий
      getNewToken(oauth2Client, (auth) => {
        console.log("Authorization complete. Token:", auth.credentials);
        tokenClient(oauth2Client.credentials);
      });
    } else {
      oauth2Client.credentials = JSON.parse(token);
      if (isTokenExpiring(oauth2Client.credentials)) {
        // Якщо токен скоро застаріє, ми отримуємо новий
        getNewToken(oauth2Client, (auth) => {
          console.log("Authorization complete. Token:", auth.credentials);
          tokenClient(oauth2Client.credentials);
        });
      } else {
        // Якщо токен ще дійсний, ми використовуємо його
        tokenClient(oauth2Client.credentials);
      }
    }
  });
}

module.exports = { authorize };
