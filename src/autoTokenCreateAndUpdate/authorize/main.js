const fs = require("fs");
const { authorize } = require("./authorize");

fs.readFile(
  "./src/autoTokenCreateAndUpdate/client_secret.json",
  function processClientSecrets(err, content) {
    if (err) {
      console.log("Error loading client secret file: " + err);
      return;
    }
    authorize(JSON.parse(content));
  }
);
