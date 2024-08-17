const { spotifyAuth, getCurrentPlayingTrack } = require('./spotify')
const { createBrowser } = require('./browser');
const { sendMessage } = require('./sendMessage');

module.exports = {

  retrieveLyrics: async () => {

    try {
      const accessToken = await spotifyAuth();

      const currentTrack = await getCurrentPlayingTrack(accessToken);

      if (!currentTrack) {
        throw new Error('Error fetching current playing track:');
      }

      const { artistName, trackName } = currentTrack;
      // try this got bug
      // SUDA MASAKI
      // 化かし愛

      // Tani Yuuki
      // Cheers

      //this will cause translation : false can do further debug
      // Tani Yuuki
      // kotodama
      const lyrics = await createBrowser(trackName, artistName);
      const embedMsg = await sendMessage(trackName, artistName, lyrics);
      return embedMsg;
    } catch (error) {
      console.error(error);
      return {
        color: 0x2A3A61,
        title: 'Error',
        description: `By -`,
        timestamp: new Date().toISOString(),
        footer: {
          text: 'Powered by SpotifyLyrics',
        },
      }
    }

  }
}