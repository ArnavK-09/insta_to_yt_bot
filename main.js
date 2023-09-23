// imports
const { scrapeInstagramPost } = require("./createVideo.js");
const usernames = require("./usernames.js");
const cron = require("node-cron");
const { uploadVideo } = require("./uploadVideoToYoutube.js");

// Main
const main = () => {
  let username = usernames[Math.floor(Math.random() * usernames.length)];
  console.log("[PROGRAM] Main Thread Started!");
  scrapeInstagramPost(username)
    .then(async () => {
      console.log("[DEBUG] Insta Posts Scraped!");
      uploadVideo(username)
    })
    .catch((error) => {
      console.error("[ERROR]\n", error);
    });
};

// cron shop
console.log("[PROGRAM] Main Script Started First Time!");
main();
/*
cron.schedule("* * 6 * *", () => {
  console.log("[PROGRAM] Cron Job Schedule Called!");
  main();
});*/
