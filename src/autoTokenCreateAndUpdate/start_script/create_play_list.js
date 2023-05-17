const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const SCOPES = [
  "https://www.googleapis.com/auth/youtube",
  "https://www.googleapis.com/auth/youtube.channel-memberships.creator",
  "https://www.googleapis.com/auth/youtube.force-ssl",
  "https://www.googleapis.com/auth/youtube.readonly",
  "https://www.googleapis.com/auth/youtube.upload",
  "https://www.googleapis.com/auth/youtubepartner",
  "https://www.googleapis.com/auth/youtubepartner-channel-audit",
];
// const SCOPES = ["https://www.googleapis.com/auth/youtube.force-ssl"];
const TOKEN_DIR =
  (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) +
  "/.credentials/";
const TOKEN_PATH = TOKEN_DIR + ".youtube-nodejs-quickstart.json";

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
  rl.question("Enter the code from that page here: ", function (encodedCode) {
    rl.close();
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
  });
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

fs.readFile(
  "./src/userPlayLists/client_secret.json",
  function processClientSecrets(err, content) {
    if (err) {
      console.log("Error loading client secret file: " + err);
      return;
    }
    authorize(JSON.parse(content), createPlaylist);
  }
);

function authorize(credentials, callback) {
  const clientSecret = credentials.installed.client_secret;
  const clientId = credentials.installed.client_id;
  const redirectUrl = credentials.installed.redirect_uris[0];
  const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

  fs.readFile(TOKEN_PATH, function (err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}

function createPlaylist(auth) {
  const service = google.youtube("v3");
  service.playlists.insert(
    {
      auth: auth,
      part: "snippet,status",
      requestBody: {
        snippet: {
          title: "TEST",
          description: "This is a test playlist created by the YouTube API v3",
        },
        status: {
          privacyStatus: "private",
        },
      },
    },
    function (err, response) {
      if (err) {
        console.log("createPlaylist: the API returned an error: " + err);
        return;
      }

      console.log("Created playlist with id: " + response.data.id);
      addVideoToPlaylist(auth, response.data.id, "M0ICeuJ4Vns");
    }
  );
}

function addVideoToPlaylist(auth, playlistId, videoId) {
  const service = google.youtube("v3");
  service.playlistItems.insert(
    {
      auth: auth,
      part: "snippet",
      requestBody: {
        snippet: {
          playlistId: playlistId,
          resourceId: {
            kind: "youtube#video",
            videoId: videoId,
          },
        },
      },
    },
    function (err, response) {
      if (err) {
        console.log("TaddVideoToPlaylis: the API returned an error: " + err);

        return;
      }

      console.log("Added video to playlist.");
    }
  );
}

// В этом коде:

// 1. Библиотеки `fs`, `readline` и `googleapis` импортируются из соответствующих модулей.
// 2. `SCOPES` содержит список областей доступа для YouTube API.
// 3. `TOKEN_DIR` и `TOKEN_PATH` указывают на директорию и путь для сохранения файла с токеном авторизации.
// 4. `getNewToken` - функция для получения нового токена авторизации с помощью интерфейса командной строки.
// 5. `storeToken` - функция для сохранения токена в файл.
// 6. `fs.readFile` - чтение файла с клиентскими секретами и вызов функции `authorize` для авторизации приложения.
// 7. `authorize` - функция для авторизации приложения с использованием клиентских секретов и токена авторизации.
// 8. `createPlaylist` - функция для создания нового плейлиста на YouTube с помощью YouTube API. Затем вызывается функция `addVideoToPlaylist` для добавления видео в созданный плейлист.
// 9. `addVideoToPlaylist` - функция для добавления видео в плейлист на YouTube.

// Пожалуйста, обратите внимание, что для корректной работы этого кода необходимо иметь файл `client_secret.json`, содержащий секреты вашего приложения, а также настроенные права доступа для YouTube API.
