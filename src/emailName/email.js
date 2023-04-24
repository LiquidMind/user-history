const address = "testing_User@gmail.com";

const emailNickName = address.replace(/[@.]/g, "");
console.log(emailNickName);
module.exports = emailNickName;
