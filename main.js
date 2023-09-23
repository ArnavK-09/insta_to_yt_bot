// imports
const {
  downloadFileFromUrl,
  scrapeInstagramPost,
} = require("./createVideo.js");
const usernames = require("./usernames.js");
const cron = require("node-cron");
const uploadVideoToYoutube = require("./uploadVideoToYoutube.js");
// utils
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Get username
let username = usernames[Math.floor(Math.random() * usernames.length)];

// cron shop
cron.schedule("* * 6 * *", () => {
  scrapeInstagramPost(username)
    .then(async (postURLs) => {
      await uploadVideoToYoutube(username);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
