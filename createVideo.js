// imports
const axios = require("axios");
const fs = require("fs");
const puppeteer = require("puppeteer");

/**
 * Downloads media file from Http URL in path mentioned
 * @param media_url
 * @param destination
 */
const downloadFileFromUrl = async (media_url, destination = "./video.mp4") => {
  const writer = fs.createWriteStream(destination);
  const response = await axios({
    url: media_url,
    method: "GET",
    responseType: "stream",
  });
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
};

/**
 * Download Insta file from username
 * @param {string} username
 */
const scrapeInstagramPost = async (username) => {
  // new browser
  const browser = await puppeteer.launch({
    headless: "new",
  });

  // get user vid
  const page = await browser.newPage();

  // Go to the user's profile page
  await page.goto(`https://greatfon.com/v/${username}`);
  // Wait for the user profile to load with an extended timeout
  await page.waitForSelector("a").catch((e) => {
    console.log(e);
  });

  // Extract the post URLs
  const postURLs = await page.evaluate(() =>
    Array.from(document.querySelectorAll("a"))
      .map((d) => d.getAttribute("href"))
      .filter((z) => z.startsWith("/c/")),
  );
  const post = postURLs[Math.floor(Math.random() * postURLs.length)];

  // Get video
  const page2 = await browser.newPage();
  await page2.goto(`https://greatfon.com${post}`);
  await page2.waitForSelector("video").catch((e) => {
    console.log(e);
  });

  // Extract the post URLs
  const vids = await page2.evaluate(() =>
    Array.from(document.querySelectorAll("video")).map((d) =>
      d.getAttribute("src"),
    ),
  );
  // download url
  await downloadFileFromUrl(vids[0]);

  // Close the browser
  await browser.close();
  //return
  return postURLs;
};
module.exports = { scrapeInstagramPost, downloadFileFromUrl };
