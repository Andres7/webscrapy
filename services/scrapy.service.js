const puppeteer = require('puppeteer');
const { config } = require('../helpers/config');


const autoScroll = async (page) => {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight - window.innerHeight) {
                    clearInterval(timer);
                    resolve();
                }

            }, 100);
        });
    });
}

const sendResponse = (status, response, end, socket) => {
    try {
        if (response != null) {
            for (let row of response) {
                socket.emit('response', { status, data: { data: row, end } });
            }
        } else {
            socket.emit('response', { status, data: { data: response, end } });
        }
    } catch (ex) {
        console.error(ex);
    }
}

const service = {

    async search({ texto, masContent }, socket) {
        try {

            const brower = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
            const page = await brower.newPage();
            await page.setViewport({ width: 1920, height: 1080 });

            if (!masContent) {
                await page.goto(config.STOCK[0], [1000, { waitUntil: "domcontentloaded" }]);
                await page.type('.header__search-form__flex-wrap input', texto)
                await page.click('.header__search-form__flex-wrap button');
                await page.waitForSelector('.photo-grid');
                await autoScroll(page);
                const resultsSelector = '.photo-grid a';
                const response = await page.evaluate(resultsSelector => {
                    return [...document.querySelectorAll(resultsSelector)].map(element => {
                        const img = element.querySelector('img');
                        return { link: '', img: img.src };
                    });
                }, resultsSelector);
                await sendResponse(true, response, false, socket);
            }

            if (masContent) {
                await page.goto(config.STOCK[1], [1000, { waitUntil: "domcontentloaded" }]);
                if (texto != '') {
                    await page.type('.search input', texto)
                    await page.click('.search button');
                }
                await page.waitForSelector('.wookmark-initialised');
                await autoScroll(page);
                const resultsSelector = '.wookmark-initialised a';
                const response = await page.evaluate(resultsSelector => {
                    return [...document.querySelectorAll(resultsSelector)].map(element => {
                        const img = element.querySelector('img');
                        return { link: element.href, img: img.src };
                    });
                }, resultsSelector);
                await sendResponse(true, response, false, socket);
            }

            await sendResponse(true, null, true, socket);

            await brower.close();
        } catch (error) {
            console.log(error);
            await sendResponse(true, null, true, socket);
        }
    },

    async detail({ texto }, socket) {
        const brower = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await brower.newPage();
        await page.setViewport({ width: 1920, height: 1080 });
        await page.goto(texto, [1000, { waitUntil: "domcontentloaded" }]);
        await page.waitForSelector('.wookmark-initialised');
        await autoScroll(page);
        const resultsSelector = '.wookmark-initialised a';
        const response = await page.evaluate(resultsSelector => {
            return [...document.querySelectorAll(resultsSelector)].map(element => {
                const img = element.querySelector('img');
                return { link: element.href, img: img.src };
            });
        }, resultsSelector);
        await sendResponse(true, response, false, socket);
        await sendResponse(true, null, true, socket);
        await brower.close();
    }

}

module.exports = service;