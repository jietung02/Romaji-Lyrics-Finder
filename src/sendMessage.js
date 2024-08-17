const sendMessage = async (songName, artist, content) => {
  try {
    const lyrics = content.romaji_eng || content.romaji || content.english;

    if (!lyrics) {
      throw new Error('No Lyrics Found');
    }

    const EmbedMessage = {
      color: 0x2A3A61,
      title: songName,
      description: `By ${artist}`,
      fields: lyrics.map((para) => {
        //dynamically split by (.) and join for each object
        const refinedPara = Object.entries(para).map(([key, value]) => {
          if (key === 'romaji' || key === 'english') {
            value = value.split('.').filter((value) => value !== '').join('\n');
          }
          return [key, value];
        });

        //convert the array back to object
        const backToObject = Object.fromEntries(refinedPara);

        return {
          name: `__**Section ${para.paragraph}**__`,
          value: `${backToObject.romaji ? '***-Romaji-***\n' + backToObject.romaji + '\n' : ''}
        ${backToObject.english ? '***-English-***\n' + backToObject.english : ''}`,
          inline: false,
        }
      }),

      timestamp: new Date().toISOString(),
      footer: {
        text: 'Powered by SpotifyLyrics',
      },
    }
    return EmbedMessage;

  } catch (error) {
    throw new Error(error.message);
  }

}



module.exports = { sendMessage, };