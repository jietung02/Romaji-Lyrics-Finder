const puppeteer = require('puppeteer');
const path = require('path');
const { findLyricfromWebsite1 } = require('./website1');
const { findLyricfromWebsite2 } = require('./website2');

module.exports = {
  createBrowser: async (trackName, artistName) => {
    
    let lyrics = {};
    const pathToExtension = path.join(process.cwd(), 'my-extension');
    const userDataDir = path.join(process.cwd(), 'chrome-user-data');
    const browser = await puppeteer.launch({
      headless: 'new',
      userDataDir: userDataDir,
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
    });

    try {

      const page = await browser.newPage();
      await page.setUserAgent('Chrome/127.0.6533.120')

      lyrics = await findLyricfromWebsite1(page, trackName, artistName);
      // lyrics = { translation: false };

      if (lyrics.hasOwnProperty('romaji_eng')) {
        return lyrics;
      }

      lyricsFromWeb2 = await findLyricfromWebsite2(page, trackName, artistName);

      if (lyricsFromWeb2.hasOwnProperty('romaji_eng') || lyricsFromWeb2.hasOwnProperty('romaji')) {
        console.log('Returning From Website 2');
        return lyricsFromWeb2;
      }

      return lyrics;

    } catch (error) {
      console.error('Error fetching lyrics:', error);
      throw new Error(error.message);

    } finally {
      browser.close();
    }

  },

  //check on how to validate the webpage to prevent the code stuck in this function, add reject promise, as now it will only return when the code the code is found
  openBrowser: async (url) => {
    return new Promise(async (resolve, reject) => {
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
      await page.goto(url);
      page.on('framenavigated', async frame => {

        const url = frame.url();
        const tokenURL = new URL(url);
        const params = tokenURL.searchParams;
        const code = params.get('code');

        if (code !== null) {
          await browser.close();
          resolve(code);
        }

      });
    });
  }
}


