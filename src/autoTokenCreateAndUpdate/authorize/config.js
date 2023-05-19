const { google } = require("googleapis");

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
// const TOKEN_PATH = TOKEN_DIR + "maysksksks32@gmail.com.json";

// module.exports = { SCOPES, TOKEN_DIR, TOKEN_PATH };
module.exports = { SCOPES, TOKEN_DIR };
