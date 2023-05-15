const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const tokenClient = require(".//testCreatPlaylist");

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
const TOKEN_PATH = TOKEN_DIR + "youtube-nodejs-quickstart.json";

function getNewToken(oauth2Client, callback) {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url: ", authUrl);

  const getPuppeteerCode = async () => {
    puppeteer.use(StealthPlugin());
    const browser = await puppeteer.launch({
      headless: false,
      executablePath:
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    });
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36"
    );
    const url = `${authUrl}`;
    await page.goto(url);

    await page.type("#identifierId", "andriykozh33@gmail.com");

    await page.click("#identifierNext");
    await page.waitForNavigation({ timeout: 60000 });

    await page.waitForSelector('input[name="Passwd"].whsOnd.zHQkBf', {
      visible: true,
    });
    await page.type('input[name="Passwd"].whsOnd.zHQkBf', "Max190716");

    await page.evaluate(() => {
      const nextButton = Array.from(document.querySelectorAll("button")).find(
        (button) => button.textContent.includes("Next")
      );
      if (nextButton) nextButton.click();
    });

    // Wait for navigation after clicking "Next"
    await page.waitForNavigation({ timeout: 60000 });

    // Get URL from the current page
    const currentUrl = await page.evaluate(() => window.location.href);
    const input = currentUrl;

    const regex = /(4%2F[^&]*)/;
    const matches = input.match(regex);
    if (matches && matches.length > 0) {
      return matches[1];
    }
    return null;
  };

  getPuppeteerCode().then((encodedCode) => {
    if (encodedCode) {
      const code = decodeURIComponent(encodedCode);
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
  });
}

////////////////////////////////////
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

function authorize(credentials) {
  const clientSecret = credentials.installed.client_secret;
  const clientId = credentials.installed.client_id;
  const redirectUrl = credentials.installed.redirect_uris[0];
  const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

  fs.readFile(TOKEN_PATH, function (err, token) {
    if (err) {
      getNewToken(oauth2Client, (auth) => {
        console.log("Authorization complete. Token:", auth.credentials);
        tokenClient(oauth2Client.credentials);
      });
    } else {
      oauth2Client.credentials = JSON.parse(token);
      tokenClient(oauth2Client.credentials);
      // console.log("Authorization complete. Token:", oauth2Client.credentials);
    }
  });
}
