const puppeteer = require('puppeteer');

const config = require('./config');
const credentials = require('./credetials');
const { appendRandomTags, saveImage } = require('./utils');

const { retrieveRedditPost } = require('./reddit-scraper');

const USERNAME_SELECTOR = '[name="username"]';
const PASSWORD_SELECTOR = '[name="password"]';
const LOGIN_SELECTOR = 'form > span > button';

const NOTNOW_SELECTOR = 'main > div > button';

const NEWPOST_SELECTOR = '[aria-label="New Post"]';

(async () => {
  try {
    const redditPost = await retrieveRedditPost();
    redditPost.topComment = appendRandomTags(redditPost.topComment);
    const fileName = await saveImage(redditPost.imageUrl);

    console.log(__dirname + '/' + fileName);

  } catch (error) {
    console.error(error);
  }

})();

async function simulateBrowser() {
  try {
    const browser = await puppeteer.launch({ headless: false, slowMo: 50 });
    const page = await browser.newPage();
    page.setUserAgent(config.userAgent);
    // page.setViewport({ isMobile: true });
    await page.goto('https://www.instagram.com/accounts/login/');

    await page.waitFor(USERNAME_SELECTOR);
    await page.waitFor(PASSWORD_SELECTOR);

    await page.tap(USERNAME_SELECTOR);
    await page.keyboard.type(credentials.username);

    await page.tap(PASSWORD_SELECTOR);
    await page.keyboard.type(credentials.password);

    await page.tap(LOGIN_SELECTOR);

    await page.waitFor(NOTNOW_SELECTOR);
    await page.tap(NOTNOW_SELECTOR);

    await page.waitFor(NEWPOST_SELECTOR);


    // await browser.close();

  } catch (error) {
    throw error;
  }
}