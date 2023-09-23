const puppeteer = require('puppeteer');
const { downloadFileFromUrl } = require('./createVideo.js')
const sleep = ms => new Promise(r => setTimeout(r, ms));
const scrapeInstagramPosts = async (username) => {
    const browser = await puppeteer.launch({
        headless: 'new'
    });
    const page = await browser.newPage();

    // Go to the user's profile page
    await page.goto(`https://greatfon.com/v/${username}`);
    // Wait for the user profile to load with an extended timeout
    await page.waitForSelector('a').catch(e => { console.log(e) });

    // Extract the post URLs
    const postURLs = await page.evaluate(
        () =>
            Array.from(document.querySelectorAll('a')).map((d) => d.getAttribute('href')).filter(z => z.startsWith('/c/'))
    );
    const post = postURLs[Math.floor(Math.random() * postURLs.length)];
    console.log(post)

    const page2 = await browser.newPage();
    await page2.goto(`https://greatfon.com${post}`);
    await page2.waitForSelector('video').catch(e => { console.log(e) });

    // Extract the post URLs
    const vids = await page2.evaluate(
        () =>
            Array.from(document.querySelectorAll('video')).map((d) => d.getAttribute('src'))
    );
    vid = vids[0]
    await downloadFileFromUrl(vid)
    console.log(vids)


    // Close the browser
    await browser.close();

    return postURLs;
    // div > .content__item
};


// Get username
let username = 'speed_mcqueen_official'


scrapeInstagramPosts(username)
    .then((postURLs) => {
        console.log('Post URLs:', postURLs);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
