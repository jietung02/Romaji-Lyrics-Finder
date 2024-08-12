const { default: axios } = require("axios");
const qs = require('qs');
const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
const puppeteer = require('puppeteer');
const urlocator = require('url');
const path = require('path');
const { transferableAbortController } = require("util");
const findLyricfromWebsite1 = require('./src/website1');
const findLyricfromWebsite2 = require('./src/website2')
const channelID = process.env.CHANNELID;


let accessToken = null;
let refreshToken = null;
let expiresIn = null;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages] });

const app = express();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
})

client.login(process.env.DISCORDBOTTOKEN);

client.on('messageCreate', async (msg) => {
    try {
        const prefix = '!';
        
        if (msg.content.startsWith(prefix) && msg.channelId === channelID && msg.content.toUpperCase() === '!LYR') {
            // if (refreshToken === null) {
            //     console.log('Getting authorisation code');
            //     const url = 'https://accounts.spotify.com/authorize?' +
            //         qs.stringify({
            //             response_type: 'code',
            //             client_id: process.env.CLIENTID,
            //             scope: process.env.SCOPE,
            //             redirect_uri: process.env.REDIRECTURI,
            //         });
            //     const code = await openBrowser(url);

            //     if (code === null) {
            //         throw new Error('Code is Null');
            //     }
            //     const accessTokenData = await getAccessToken(code);

            //     if (accessTokenData === null) {
            //         throw new Error('Failed to Get Access Token');
            //     }

            //     ({ access_token: accessToken, refresh_token: refreshToken, expires_in: expiresIn } = accessTokenData);
            //     expiresIn = getCurrentTimestamp() + expiresIn;
            // }
            // else {
            //     console.log('No need to get new');
            //     console.log(getCurrentTimestamp());
            //     console.log(expiresIn);
            //     if (getCurrentTimestamp() >= expiresIn) {
            //         console.log('Token Expired, Obtaining new Access Token');
            //         const accessTokenData = await getNewAccessToken(refreshToken);

            //         if (accessTokenData === null) {
            //             throw new Error('Failed to Get New Access Token');
            //         }

            //         ({ access_token: accessToken, refresh_token: refreshToken, expires_in: expiresIn } = accessTokenData);
            //         expiresIn = getCurrentTimestamp() + expiresIn;
            //     }
            // }
            // const currentTrack = await getCurrentPlayingTrack(accessToken);

            // if (currentTrack && currentTrack.item) {
            //     const { item: { album: { artists: [{ name: artistName }] }, name: trackName } } = currentTrack;
            //     console.log(artistName);
            //     console.log(trackName);
            //     const lyrics = getLyric(trackName, artistName);
            // }
            // const lyrics = await createBrowser('呼吸', 'Masaki Suda');
            // const lyrics = await createBrowser('虹 ', 'Masaki Suda');
            // const lyrics = await createBrowser('惑う糸', 'Masaki Suda');
            // const lyrics = await createBrowser('MAKAFUKA', 'RADWIMPS');

            // const lyrics = await createBrowser('ドライフラワー', 'Yuuri');
            // const lyrics = await createBrowser('Lemon', 'Kenshi Yonezu');
            const lyrics = await createBrowser('ロングホープ・フィリア', 'Masaki Suda');


            console.log(lyrics);

        }
    } catch (error) {
        console.error(error);
    }


})

const createBrowser = async (trackName, artistName) => {
    let lyrics = {};
    const pathToExtension = path.join(process.cwd(), 'my-extension');
    const userDataDir = path.join(__dirname, 'chrome-user-data');
    const browser = await puppeteer.launch({
        headless: false,
        userDataDir: userDataDir,
        args: [
            `--disable-extensions-except=${pathToExtension}`,
            `--load-extension=${pathToExtension}`,
        ],
    });

    const page = await browser.newPage();
    lyrics = await findLyricfromWebsite1(page, trackName, artistName);

    // if (lyrics.hasOwnProperty('translation')) {
    //     lyrics = await findLyricfromWebsite2(page, lyrics, trackName, artistName, 'ROMAJI&ENG');
    //     // lyrics = await findLyricfromWebsite2(page, lyrics, '惑う糸', 'Masaki Suda', 'ROMAJI&ENG');

    // }
    // else if (!lyrics.hasOwnProperty('romaji_eng')) {
    //     if (lyrics.hasOwnProperty('romaji')) {
    //         lyrics = await findLyricfromWebsite2(page, lyrics, trackName, artistName, 'ENGLISH');
    //         // lyrics = await findLyricfromWebsite2(page, lyrics, '惑う糸', 'Masaki Suda', 'ENGLISH');
    //     }
    //     else if (lyrics.hasOwnProperty('english')) {
    //         lyrics = await findLyricfromWebsite2(page, lyrics, trackName, artistName, 'ROMAJI');
    //         // lyrics = await findLyricfromWebsite2(page, lyrics, '惑う糸', 'Masaki Suda', 'ROMAJI');
    //     }
    //     else {
    //         lyrics = null;
    //     }
    // }
    browser.close();
    // lyrics = await findLyricfromWebsite2(page, lyrics, '惑う糸', 'Masaki Suda', 'ROMAJI&ENG');
    // lyrics = await findLyricfromWebsite2(page, lyrics, 'Thunder Blossom', 'MAISONdes', 'ROMAJI&ENG');
    return lyrics;
}




//check on how to validate the webpage to prevent the code stuck in this function, add reject promise, as now it will only return when the code the code is found
const openBrowser = async (url) => {
    return new Promise(async (resolve) => {
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

const getAccessToken = async (code) => {
    const data = {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.REDIRECTURI,

    }
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (new Buffer.from(process.env.CLIENTID + ':' + process.env.SECRET).toString('base64')),
    }

    const tokenData = axios.post(process.env.CLIENTTOKENENDPOINT, qs.stringify(data), { headers: headers }).then(response => {
        if (response.status !== 200) {
            return null;
        }
        return response.data;
    });
    return tokenData;
}

const getNewAccessToken = (refresh_token) => {
    const data = {
        grant_type: 'refresh_token',
        code: refresh_token,
    }
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (new Buffer.from(process.env.CLIENTID + ':' + process.env.SECRET).toString('base64')),
    }

    const tokenData = axios.post(process.env.CLIENTTOKENENDPOINT, qs.stringify(data), { headers: headers }).then(response => {
        if (response.status !== 200) {
            return null;
        }
        return response.data;
    });
    return tokenData;
}

const getCurrentPlayingTrack = async (token) => {
    const data = {
        'market': process.env.MARKET
    }

    const endpoint = process.env.ENDPOINT + '/' + process.env.CURRENTLYPLAYING;
    const currentTrack = await axios.get(endpoint, {
        params: data,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    }).then(response => {
        return response.data;
    })
    return currentTrack;
}

const getCurrentTimestamp = () => {
    return Math.floor(Date.now() / 1000);
}

// const mainApp = async () => {
//     const clientToken = await getClientToken();
//     const token = await getAccessToken(clientToken);
//     // await getCurrentPlayingTrack(token);
// }
// mainApp();

app.get('/login', async (req, res) => {
    res.redirect('https://accounts.spotify.com/authorize?' +
        qs.stringify({
            response_type: 'code',
            client_id: process.env.CLIENTID,
            scope: process.env.SCOPE,
            redirect_uri: process.env.REDIRECTURI,
        }));
})

app.listen(3000, () => {
    console.log('Listening to Port 3000');
})



