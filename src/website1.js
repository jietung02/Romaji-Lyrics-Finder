const getLyricsfromWebsite1 = async (page, lyrics, type) => {
  // inside here check if the lyrics object exist romaji or english, if exist then can return since it is already fetched.
  if (type !== 'Romanization' && type !== 'English' && type !== 'ROMAJI' || (lyrics.hasOwnProperty('ROMAJI') && lyrics.hasOwnProperty('ENGLISH'))) {
    console.log('return for ' + type)
    return { ...lyrics };
  }
  else if ((type === 'Romanization' && lyrics.hasOwnProperty('ROMAJI')) || (type === 'English' && lyrics.hasOwnProperty('ENGLISH'))) {
    console.log('return for ' + type)
    return { ...lyrics };
  }

  const contentsLyrs = await page.evaluate(() => {
    const elements = document.querySelectorAll('.Lyrics__Container-sc-1ynbvzw-1.kUgSbL');
    const lyricContent = [];
    elements.forEach(element => {
      lyricContent.push(element.innerHTML);
    });
    return lyricContent;
  });

  const keyName = type === 'English' ? 'ENGLISH' : 'ROMAJI';
  return { ...lyrics, [keyName]: contentsLyrs };

}

const removeSongStructure = (lyric) => {
  return lyric.replace(/\[.*?\]/g, '');
}

const combineToString = (lyrics) => {
  return (lyrics.reduce((prev, cur, index) => {

    const separator = index <= lyrics.length - 1 || index === 0 ? "<br>" : "";
    prev = prev + separator
    return prev + cur + separator;
  }));
}

const removeHTMLTagExceptBr = (lyricString) => {
  return lyricString.replace(/<(?!br\s*\/?)[^>]+>/g, '').replaceAll('<br>', '.');
}

const splitNewParagraph = (lyricString) => {
  return lyricString.split('..');
}

const reformatLyrics = (lyrics) => {

  if (lyrics.hasOwnProperty('ROMAJI') && lyrics.hasOwnProperty('ENGLISH')) {
    const english = lyrics.ENGLISH;
    const romaji = lyrics.ROMAJI;

    const joinEnglish = combineToString(english);
    const joinRomaji = combineToString(romaji);

    filteredEnglyrics = removeHTMLTagExceptBr(joinEnglish);
    filteredRomajilyrics = removeHTMLTagExceptBr(joinRomaji);

    const englishSplitParagraph = splitNewParagraph(filteredEnglyrics);
    const romajiSplitParagraph = splitNewParagraph(filteredRomajilyrics);



    if (englishSplitParagraph.length !== romajiSplitParagraph.length) {
      romajiSplitParagraph.splice(0, 1); //remove the first one if it could be a subheading for the song example : [​菅田将暉「ロングホープ・フィリア」羅馬拼音歌詞]
    }

    const combinedArray = romajiSplitParagraph.map((value, index) => {
      const englishText = englishSplitParagraph[index];
      return {
        paragraph: index + 1,
        romaji: value,
        english: englishText !== undefined ? englishText : '',

      }
    });
    combinedArray.forEach((item) => {
      item.romaji = removeSongStructure(item.romaji);
      item.english = removeSongStructure(item.english);
    })

    return { romaji_eng: combinedArray };
  }
  else if (lyrics.hasOwnProperty('ROMAJI') && !lyrics.hasOwnProperty('ENGLISH')) {
    const romaji = lyrics.ROMAJI;
    const joinRomaji = combineToString(romaji);

    filteredRomajilyrics = removeHTMLTagExceptBr(joinRomaji);

    const romajiSplitParagraph = splitNewParagraph(filteredRomajilyrics);

    if (romajiSplitParagraph.length > 0 && romajiSplitParagraph[0].includes('「') && romajiSplitParagraph[0].includes('」')) {
      romajiSplitParagraph.shift();
    }

    const combinedArray = romajiSplitParagraph.map((value, index) => {
      return {
        paragraph: index + 1,
        romaji: value,
      }
    });

    combinedArray.forEach((item) => {
      item.romaji = removeSongStructure(item.romaji);
    });

    return { romaji: combinedArray };
  }

  else if (!lyrics.hasOwnProperty('ROMAJI') && lyrics.hasOwnProperty('ENGLISH')) {
    const english = lyrics.ENGLISH;
    const joinEnglish = combineToString(english);
    filteredEnglyrics = removeHTMLTagExceptBr(joinEnglish);
    const englishSplitParagraph = splitNewParagraph(filteredEnglyrics);

    const combinedArray = englishSplitParagraph.map((value, index) => {
      return {
        paragraph: index + 1,
        english: value,

      }
    });

    combinedArray.forEach((item) => {
      item.english = removeSongStructure(item.english);
    });

    return { english: combinedArray };
  }
  else {
    return null;
  }
}

module.exports = {
  
  findLyricfromWebsite1: async (page, trackName, artistName) => {
    try {
      let lyrics = {};

      page.goto(process.env.LYRICSWEBSITE1, { timeout: 60000 });

      await page.waitForSelector('.PageHeaderSearchdesktop__Input-eom9vk-2.gajVFV');
      await page.type('.PageHeaderSearchdesktop__Input-eom9vk-2.gajVFV', `${trackName} ${artistName}`, { delay: 50 });
      const element = await page.waitForSelector('div.styleAnchors__PageHeaderDropdownMenu-sc-16isfwt-1.PageHeaderDropdowndesktop__Container-sc-12d2okf-0.gEDedm iframe');
      const frame = await element.contentFrame();
      await frame.waitForSelector('.mini_card');

      let hrefs = await frame.$$eval('.mini_card', (elements) => elements.map(ele => ele.getAttribute('href')));
      //getting the SONGS Not Top Result

      if (hrefs.length >= 3) {
        hrefs = hrefs.slice(1, 3);
      }
      else {
        hrefs = hrefs.slice(1, 2);
      }

      let type = null;
      for (let i = 0; i < hrefs.length; i++) {
        await page.goto(hrefs[i]);

        await page.waitForSelector('.SongHeaderdesktop__HiddenMask-sc-1effuo1-11.iMpFIj');
        const title = await page.evaluate(() => document.querySelector('.SongHeaderdesktop__HiddenMask-sc-1effuo1-11.iMpFIj').innerHTML)
        console.log(title);

        if (!title.includes(trackName)) {
          console.log('Track Name Not Matched')
          return { translation: false };
        }
        else if (!title.includes('Romanized')) {
          console.log('Not Romanised');
          //check whether it has 'Romanization' instead of just checking the dropdown box
          const translation = await page.$('.Dropdown__Container-ugfjuc-0.gGGmJL');

          if (translation === null && (i === hrefs.length - 1 || hrefs.length < 2)) {
            console.log('Next Website');
            return { translation: false };
          }
          else if (translation === null && i < hrefs.length) {
            console.log('Go Next');
            continue;
          }
          else {
            console.log('Not Romanised but has Translation');
            await page.waitForSelector('.TextButton-sc-192nsqv-0.hVAZmF.LyricsHeader__TextButton-ejidji-10.iljvxT');
            //parent TextButton-sc-192nsqv-0 hVAZmF LyricsHeader__TextButton-ejidji-10 iljvxT
            const availableTranslation = await page.$$('.TextButton-sc-192nsqv-0.hVAZmF.LyricsHeader__TextButton-ejidji-10.iljvxT');

            const found = await Promise.all(availableTranslation.map(async element => {
              const text = await element.getProperty('textContent');
              const href = await element.getProperty('href');
              const textContent = await text.jsonValue();
              const hrefContent = await href.jsonValue();
              return textContent === 'Romanization' | textContent === 'English' ? { language: textContent, link: hrefContent } : null;
            }))

            const filteredFound = found.filter(Boolean);
            for (const data of filteredFound) {
              await page.goto(`${data.link}`, { timeout: 60000 });
              await page.waitForSelector('.Lyrics__Container-sc-1ynbvzw-1.kUgSbL');
              lyrics = await getLyricsfromWebsite1(page, lyrics, data.language);
            }

            if (lyrics.hasOwnProperty('ROMAJI') && lyrics.hasOwnProperty('ENGLISH')) {
              break;
            }

          }
        }
        else {
          type = 'STARTROMAJI';
          console.log('Has Romanised');
          lyrics = await getLyricsfromWebsite1(page, lyrics, 'ROMAJI');
        }
      }

      const combinedLyrics = reformatLyrics(lyrics);

      if (combinedLyrics === null) {
        return { translation: false };
      }
      else {
        return combinedLyrics;
      }

    } catch (error) {
      throw new Error(error.message);
    }

  }
};