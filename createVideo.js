// imports 
const axios = require('axios');
const fs = require('fs');

/**
 * Downloads media file from Http URL in path mentioned
 * @param media_url
 * @param destination 
 */
const downloadFileFromUrl = async (media_url, destination = './media_file.mp4') => {
    const writer = fs.createWriteStream(destination);
    const response = await axios({
        url: media_url,
        method: 'GET',
        responseType: 'stream'
    });
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
};

/**
 * Download Insta file from post URL
 * @param {string} url 
 */
const instaPostToDownloadedFile = async (url = "https://www.instagram.com/p/CxIahaLoC4D/", name = "video", ex = 'mp4') => {
    // options 
    const options = {
        method: 'GET',
        url: 'https://instagram-downloader-download-instagram-videos-stories.p.rapidapi.com/index',
        params: {
            url
        },
        headers: {
            'X-RapidAPI-Key': '394711368fmshd4592c157aa4cefp120719jsn054e666ad6a4',
            'X-RapidAPI-Host': 'instagram-downloader-download-instagram-videos-stories.p.rapidapi.com'
        }
    };


    // response vars 
    const response = await axios.request(options);
    const destinationPath = `./${name}.${ex}`;


    // download url 
    downloadFileFromUrl(response.data.media, destinationPath)
        .then(() => {
            console.log('File downloaded successfully.');
        })
        .catch(error => {
            console.error('Error downloading file:', error);
        });
}

module.exports = {instaPostToDownloadedFile,downloadFileFromUrl};