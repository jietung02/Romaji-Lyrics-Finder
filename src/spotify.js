const { default: axios } = require("axios");
const qs = require('qs');

const { openBrowser, createBrowser } = require('./browser');

let accessToken = null;
let refreshToken = null;
let expiresIn = null;

const getAccessToken = async (code) => {
  const data = {
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: process.env.REDIRECTURI,

  }
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + (new Buffer.from(process.env.SPOTIFYCLIENTID + ':' + process.env.SECRET).toString('base64')),
  }

  const tokenData = axios.post(process.env.CLIENTTOKENENDPOINT, qs.stringify(data), { headers: headers }).then(response => {
    if (response.status !== 200) {
      return null;
    }
    return response.data;
  });
  return tokenData;
}

const getNewAccessToken = async (refresh_token) => {
  const data = {
    grant_type: 'refresh_token',
    code: refresh_token,
  }
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + (new Buffer.from(process.env.SPOTIFYCLIENTID + ':' + process.env.SECRET).toString('base64')),
  }

  const tokenData = axios.post(process.env.CLIENTTOKENENDPOINT, qs.stringify(data), { headers: headers }).then(response => {
    if (response.status !== 200) {
      return null;
    }
    return response.data;
  });
  return tokenData;
}

const getCurrentTimestamp = () => {
  return Math.floor(Date.now() / 1000);
}

module.exports = {

  spotifyAuth: async () => {
    try {
      if (refreshToken === null) {
        console.log('Getting authorisation code');
        const url = 'https://accounts.spotify.com/authorize?' +
          qs.stringify({
            response_type: 'code',
            client_id: process.env.SPOTIFYCLIENTID,
            scope: process.env.SCOPE,
            redirect_uri: process.env.REDIRECTURI,
          });

        const code = await openBrowser(url);
        if (!code) {
          throw new Error('Failed to obtain authorisation code');
        }
        const accessTokenData = await getAccessToken(code);

        if (accessTokenData === null) {
          throw new Error('Failed to obtain access token');
        }

        ({ access_token: accessToken, refresh_token: refreshToken, expires_in: expiresIn } = accessTokenData);

        expiresIn = getCurrentTimestamp() + expiresIn;
      }
      else {
        console.log('No need to get new');
        console.log(getCurrentTimestamp());
        console.log(expiresIn);
        if (getCurrentTimestamp() >= expiresIn) {
          console.log('Token Expired, Obtaining new Access Token');
          const accessTokenData = await getNewAccessToken(refreshToken);

          if (accessTokenData === null) {
            throw new Error('Failed to Get New Access Token');
          }

          ({ access_token: accessToken, refresh_token: refreshToken, expires_in: expiresIn } = accessTokenData);
          expiresIn = getCurrentTimestamp() + expiresIn;
        }
      }
      return accessToken;
    } catch (error) {
      throw new Error(error)
    }
  },

  getCurrentPlayingTrack: async (token) => {
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

    if (!currentTrack || !currentTrack.item) {
      return undefined
    }

    try {
      const { item: { album: { artists: [{ name: artistName }] }, name: trackName } } = currentTrack;
      console.log(artistName);
      console.log(trackName);
      return { artistName, trackName };
    } catch (error) {
      return undefined;
    }



  },
}
