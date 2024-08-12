const reformatLyricContentWebsite2 = (content, type) => {
    const filteredContent = content.replace(/<(?!\/?(p|br))[^>]*>/g, '').replace(/<p>/g, '').replace(/<\/p>/g, '<br>').trim();
    const paraContent = filteredContent.replace(/\n/g, '').split('<br><br>').filter(str => str !== '');

    // if (type === 'ROMAJI&ENG') {
    //     paraContent.map()
    // }

    return paraContent;
}

const getLyricsfromWebsite2 = async (page, lyrics, type) => {
    // 'ROMAJI&ENG'
    // 'ENGLISH'
    // 'ROMAJI'
    let newLyrics = { ...lyrics };

    const selector = (type === 'ROMAJI&(ENG)' || type === 'ENGLISH') ? '#English .olyrictext' : '#Romaji #prilyr';

    await page.waitForSelector(selector);
    const lyricsContent = await page.evaluate((selector) => {
        const content = document.querySelector(selector).innerHTML;
        return content;
    }, selector)
    const refinedLyr = reformatLyricContentWebsite2(lyricsContent, type);

    if (type === '(ROMAJI)&ENG') {

        const finalRefinedLyr = refinedLyr.map((value, index) => {
            return {
                paragraph: index + 1,
                romaji: value,
            }
        });

        return { romaji: finalRefinedLyr };
    }

    else if (type === 'ROMAJI&(ENG)') {
        const romaji = (newLyrics.romaji) ? newLyrics.romaji : null;

        if (romaji === null) {
            const finalRefinedLyr = refinedLyr.map((value, index) => {
                return {
                    paragraph: index + 1,
                    english: value,
                }
            });
            return { english: finalRefinedLyr };
        }

        else if (refinedLyr.length > romaji.length) {
            const finalRefinedLyr = refinedLyr.map((value, index) => {
                return {
                    paragraph: index + 1,
                    romaji: romaji[index].romaji,
                    english: value,
                }
            });
            return { romaji_eng: finalRefinedLyr };
        }
        else {
            const finalRefinedLyr = romaji.map((value, index) => {
                return {
                    paragraph: index + 1,
                    romaji: value.romaji,
                    english: refinedLyr[index],
                }
            });
            return { romaji_eng: finalRefinedLyr };
        }
    }

    else if (type === 'ROMAJI') {
        const english = newLyrics.english;
        if (english.length < refinedLyr) {
            const finalRefinedLyr = refinedLyr.map((value, index) => {
                return {
                    paragraph: index + 1,
                    romaji: value,
                    english: english[index].english,

                }
            });
            return { romaji_eng: finalRefinedLyr };
        }

        else {
            const finalRefinedLyr = english.map((value, index) => {
                return {
                    paragraph: index + 1,
                    romaji: refinedLyr[index],
                    english: value.english,

                }
            });
            return { romaji_eng: finalRefinedLyr };
        }

    }

    else if (type === 'ENGLISH') {
        const romaji = newLyrics.romaji;

        if (romaji.length < refinedLyr) {
            const finalRefinedLyr = refinedLyr.map((value, index) => {
                return {
                    paragraph: index + 1,
                    romaji: romaji[index].romaji,
                    english: value,

                }
            });
            return { romaji_eng: finalRefinedLyr };
        }

        else {
            const finalRefinedLyr = romaji.map((value, index) => {
                return {
                    paragraph: index + 1,
                    romaji: value.romaji,
                    english: refinedLyr[index],

                }
            });
            return { romaji_eng: finalRefinedLyr };
        }
    }

    return { newLyrics };

}

const findLyricfromWebsite2 = async (page, lyrics, trackName, artistName, type) => {

    let newLyrics = { ...lyrics };
    page.goto(process.env.LYRICSWEBSITE2, { timeout: 60000 });
    await page.waitForSelector('#gsc-i-id1');
    await page.type('#gsc-i-id1', `${trackName} ${artistName}`, { delay: 50 });
    await page.waitForSelector('.gsc-search-button.gsc-search-button-v2');
    await page.$eval('.gsc-search-button.gsc-search-button-v2', btn => btn.click());
    await page.waitForSelector('.gsc-webResult.gsc-result');

    await page.click('.gs-title');

    await page.waitForSelector('.kashiwrap.kashiwrapnbl');

    const title = await page.evaluate(() => {
        const isRomaji = document.querySelector('.kashiwrap.kashiwrapnbl').textContent;
        return isRomaji;
    });

    if (!title.includes('Romanized')) {
        return newLyrics;
    }

    await page.waitForSelector('#ui-id-3');
    const isTranslationAvailable = await page.evaluate(() => {
        const element = document.querySelector('a[href="#Translations"]');
        return element ? element : null;
    })

    if (type === 'ROMAJI&ENG') {
        newLyrics = await getLyricsfromWebsite2(page, newLyrics, '(ROMAJI)&ENG');

        if (isTranslationAvailable === null) {
            return newLyrics;
        }
        await page.click('a[href="#Translations"]');
        await page.waitForSelector('#English .olyrictext');
        newLyrics = await getLyricsfromWebsite2(page, newLyrics, 'ROMAJI&(ENG)');

    }
    else if (type === 'ROMAJI') {
        newLyrics = await getLyricsfromWebsite2(page, newLyrics, type);
    }

    else if (type === 'ENGLISH') {
        if (!isTranslationAvailable) {
            return newLyrics;
        }
        newLyrics = await getLyricsfromWebsite2(page, newLyrics, type);
    }
    //check what language available

    return newLyrics;

}

module.exports = findLyricfromWebsite2;