// Copyright 2016 Google LLC
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// https://gist.githubusercontent.com/soygul/42677432fa89df7fd783e0232a43a8cf/raw/c66bd3bb998503a515d2e43d5c3ae0a5bcde630d/youtube-upload.js

// imports
const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  // vars
  const clientSecret = credentials.installed.client_secret;
  const clientId = credentials.installed.client_id;
  const redirectUrl = credentials.installed.redirect_uris[0];
  const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

  console.log("[INFO] Youtube Auth Initiated!");
  // Check if we have previously stored a token.
  fs.readFile("token.keys.json", function (_, token) {
    oauth2Client.credentials = JSON.parse(token);
    callback(oauth2Client);
  });
}

/**
 * Init youtube upload
 * @param {string} username
 */
exports.uploadVideo = (username) => {
  // Load client secrets from a local file
  console.log("[DEBUG] Upload to Youtube Function Called! - ", username);
  fs.readFile("./oauth.keys.json", function processClientSecrets(err, content) {
    if (err) {
      console.log("[ERROR] Client secret file: \n" + err);
      return;
    }
    // Authorize a client with the loaded credentials, then call the YouTube API.
    authorize(
      JSON.parse(content),
      async (auth) => await uploadVideoToYoutube(auth, username),
    );
  });
};

// initialize the Youtube API library
const youtube = google.youtube("v3");

// very basic example of uploading a video to youtube
async function uploadVideoToYoutube(
  auth,
  username = "video",
  fileName = "video.mp4",
) {
  // Obtain user credentials to use for the request
  console.log("[INFO] Upload to Youtube Initiated!");

  console.log("[DEBUG] Upload to Youtube Request Sent!");
  const res = await youtube.videos.insert(
    {
      auth: auth,
      part: "id,snippet,status",
      notifySubscribers: true,
      requestBody: {
        snippet: {
          title: `@${username} v${Math.floor(Math.random() * 10000) + 1}`,
          description: `#InstagramMemes #FunnyMemes #Memes2023 #ViralMemes #HilariousVideos #TrendingMemes #LaughOutLoud #ComedyVideos #SocialMediaHumor #MemesCompilation #HumorGram #MemeAddict #${username}`,
        },
        status: {
          privacyStatus: "public",
        },
      },
      media: {
        body: fs.createReadStream(fileName),
      },
    }
  )
  console.log("\n[INFO] Upload to Youtube Done!\n")
  return res.data;
}

/**
 * Run this function to get your channel access tokens
 */
async function get_up_new_token() {
  fs.readFile("./oauth.keys.json", function (_, content) {
    let credentials = JSON.parse(content);

    const clientSecret = credentials.installed.client_secret;
    const clientId = credentials.installed.client_id;
    const redirectUrl = credentials.installed.redirect_uris[0];
    const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: ["https://www.googleapis.com/auth/youtube.upload"],
    });
    console.log("Authorize this app by visiting this url: ", authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question("Enter the code from that page here: ", function (code) {
      rl.close();
      oauth2Client.getToken(code, function (err, token) {
        if (err) {
          console.log("Error while trying to retrieve access token", err);
          return;
        }
        fs.writeFile("token.keys.json", JSON.stringify(token), (err) => {
          if (err) throw err;
          console.log("Token stored to " + "token.keys.json");
        });
      });
    });
  });
}
