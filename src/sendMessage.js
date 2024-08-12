const { EmbedBuilder } = require('discord.js');

const lyrics = [
  {
    paragraph: 1,
    romaji: '.Tabun, watashi janakute ii ne.Yoyuu no nai futari datta shi.Kizukeba kenka bakkari shite sa.Gomen ne',
    english: ".I guess, it doesn't have to be me.We were emotionally strained.Always fighting before we knew it.I'm sorry"
  },
  {
    paragraph: 2,
    romaji: '.Zutto hanasou to omotteta.Kitto watashitachi awanai ne.Futari kiri shika inai heya de sa.Anata bakari hanashite ita yo ne',
    english: ".For so long I've been meaning say.We probably aren't suited for each other.In a room with just the two of us.You were the only one talking"
  },
  {
    paragraph: 3,
    romaji: '.Moshi itsuka dokoka de aetara.Kyou no koto wo waratte kureru kana.Riyuu mo chanto hanasenai keredo.Anata ga nemutta ato ni naku no wa iya',
    english: ".Perhaps one day, if we meet again somewhere.Will you be able to laugh about what happened today.Can't really explain why.But I don't like crying after you've fallen asleep"
  },
  {
    paragraph: 4,
    romaji: '.Koe mo kao mo bukiyou na toko mo.Zenbu zenbu kirai janai no.Dorai furawaa mitai.Kimi to no hibi mo.Kitto kitto kitto kitto.Iroaseru',
    english: '.Your voicе, your face, your awkwardness.All of it, all of it I kind of like.Likе a dry flower.The days spent with you will.Probably, probably, probably, probably.Fade away in color'
  },
  {
    paragraph: 5,
    romaji: '.Tabun, kimi janakute yokatta.Mou nakasareru koto mo nai shi."Watashi bakari" nante kotoba mo nakunatta',
    english: `.I guess I'm glad it wasn't you.You won't make me cry anymore.Words like "why is it always on me" have disappeared`
  },
  {
    paragraph: 6,
    romaji: '.Anna ni kanashii wakare demo.Jikan ga tateba wasureteku.Atarashii hito to narabu kimi wa.Chanto umaku yarete iru no kana',
    english: ".Such a sad break-up but.Time makes you forget.You who now stand next to someone else.I wonder if it's going well for you"
  },
  {
    paragraph: 7,
    romaji: '.Mou kao mo mitakunai kara sa.Hen ni renraku shite konaide hoshii.Tsugou ga ii no wa kawattenain da ne.Demo mushi dekizu ni mata sukoshi henji',
    english: ".Never want to see your face again.Don't try to stay in touch.Still expect things to always go your way.But I can't ignore you so I answer back"
  },
  {
    paragraph: 8,
    romaji: '.Koe mo kao mo bukiyou na toko mo.Tabun ima mo kirai janai no.Dorai furawaa mitaku.Jikan ga tateba.Kitto kitto kitto kitto.Iroaseru',
    english: '.Your voice, your face, your awkwardness.I guess, even now I kind of like.Like a dry flower with passing time.Probably, probably, probably, probably.Fade away in color'
  },
  {
    paragraph: 9,
    romaji: '.Tsuki akari ni mamono ga yureru.Kitto watashi mo douka shiteru.Kurayami ni shikisai ga ukabu.Aka ki aiiro ga mune no oku.Zutto anata no namae wo yobu.Suki to iu kimochi mata kaoru',
    english: ".Evil spirits quiver in the moonlight.There's probably something wrong with me too.Colors float in the darkness.Red, yellow, blue in the depths of my heart.Keep calling out your name.Feelings of love still leave a scent"
  },
  {
    paragraph: 10,
    romaji: '..Koe mo kao mo bukiyou na toko mo.Zenbu zenbu daikirai da yo.Mada karenai hana wo.Kimi ni soete sa.Zutto zutto zutto zutto.Kakaete yo',
    english: '..Your voice, your face, your awkwardness.All of it, all of it I hate.Flowers that have yet to wilt.I place with you.Forever, forever, forever, forever.Hold on to them'
  },
  {
    paragraph: 11,
    romaji: '.Ah-ah, ah-ah.',
    english: '.Ah-ah, ah-ah.'
  }
]

// const lyrics = [
//   {
//     paragraph: 1,
//     romaji: '.Tabun, watashi janakute ii ne.Yoyuu no nai futari datta shi.Kizukeba kenka bakkari shite sa.Gomen ne',
//   },
//   {
//     paragraph: 2,
//     romaji: '.Zutto hanasou to omotteta.Kitto watashitachi awanai ne.Futari kiri shika inai heya de sa.Anata bakari hanashite ita yo ne',
//   },
//   {
//     paragraph: 3,
//     romaji: '.Moshi itsuka dokoka de aetara.Kyou no koto wo waratte kureru kana.Riyuu mo chanto hanasenai keredo.Anata ga nemutta ato ni naku no wa iya',
//   },
//   {
//     paragraph: 4,
//     romaji: '.Koe mo kao mo bukiyou na toko mo.Zenbu zenbu kirai janai no.Dorai furawaa mitai.Kimi to no hibi mo.Kitto kitto kitto kitto.Iroaseru',
//   },
//   {
//     paragraph: 5,
//     romaji: '.Tabun, kimi janakute yokatta.Mou nakasareru koto mo nai shi."Watashi bakari" nante kotoba mo nakunatta',
//   },
//   {
//     paragraph: 6,
//     romaji: '.Anna ni kanashii wakare demo.Jikan ga tateba wasureteku.Atarashii hito to narabu kimi wa.Chanto umaku yarete iru no kana',
//   },
//   {
//     paragraph: 7,
//     romaji: '.Mou kao mo mitakunai kara sa.Hen ni renraku shite konaide hoshii.Tsugou ga ii no wa kawattenain da ne.Demo mushi dekizu ni mata sukoshi henji',
//   },
//   {
//     paragraph: 8,
//     romaji: '.Koe mo kao mo bukiyou na toko mo.Tabun ima mo kirai janai no.Dorai furawaa mitaku.Jikan ga tateba.Kitto kitto kitto kitto.Iroaseru',
//   },
//   {
//     paragraph: 9,
//     romaji: '.Tsuki akari ni mamono ga yureru.Kitto watashi mo douka shiteru.Kurayami ni shikisai ga ukabu.Aka ki aiiro ga mune no oku.Zutto anata no namae wo yobu.Suki to iu kimochi mata kaoru',
//   },
//   {
//     paragraph: 10,
//     romaji: '..Koe mo kao mo bukiyou na toko mo.Zenbu zenbu daikirai da yo.Mada karenai hana wo.Kimi ni soete sa.Zutto zutto zutto zutto.Kakaete yo',
//   },
//   {
//     paragraph: 11,
//     romaji: '.Ah-ah, ah-ah.',
//   }
// ]

const sendMessage = async (channel, songName, artist, content) => {

  // const lyrics = content.romaji_eng || content.romaji || content.english;

  const test = lyrics.map((para) => {
    return {
      name: para.paragraph,
      value: para.romaji || para.english,
      inline: false,
    }
  })

  const EmbedMessage = {
    color: 0xFFF1FA,
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

      console.log(backToObject)
      return {
        name: `Section ${para.paragraph}`,
        value: `${backToObject.romaji ? '-Romaji-\n' + backToObject.romaji + '\n' : ''}
        ${backToObject.english ? '-English-\n' + backToObject.english : ''}`,
        inline: false,
      }
    }),

    timestamp: new Date().toISOString(),
    footer: {
      text: 'Powered by SpotifyLyrics',
    },
  }

  // const EmbedMessage = new EmbedBuilder()
  //   .setColor(0xFFF1FA)
  //   .setTitle(songName)
  //   .setDescription(`by ${artist}`);

  // lyrics.map((para) => {
  //   EmbedMessage.addFields()
  // })

  channel.send({ embeds: [EmbedMessage] });
}



module.exports = { sendMessage, lyrics };