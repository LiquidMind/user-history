const OAuth2 = require("googleapis").google.auth.OAuth2;
const getOrCreatePlaylist = require("./playlistHandler");

function tokenClient(token, resId) {
  const { access_token, refresh_token, token_type, expiry_date } = token;

  const oauth2Client = new OAuth2();
  oauth2Client.setCredentials({
    access_token: access_token,
    refresh_token: refresh_token,
    token_type: token_type,
    expiry_date: expiry_date,
  });
  getOrCreatePlaylist(oauth2Client, resId);
}

module.exports = tokenClient;
