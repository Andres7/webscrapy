const puppeteer = require('puppeteer');
// const { v4: uuidv4 } = require('uuid');
const { config } = require('../helpers/config');

const service = {

    async search(texto, mas) {
        // const guid = uuidv4();

        console.log("buscando...", mas);

        const brower = await puppeteer.launch({
            args: [
                '--no-sandbox', '--disable-setuid-sandbox'
            ]
        });
        const page = await brower.newPage();
        await page.setViewport({ width: 1920, height: 1080 });

        let response1 = [];
        if (!mas) {
            await page.goto(config.STOCK[0], [1000, { waitUntil: "domcontentloaded" }]);

            await page.type('.header__search-form__flex-wrap input', texto)
            await page.click('.header__search-form__flex-wrap button');
            await page.waitForSelector('.photo-grid');
            await autoScroll(page);
            response1 = await page.evaluate(() => {
                const elements = document.querySelectorAll('.photo-grid a');
                const links = [];
                for (let element of elements) {
                    const img = element.querySelector('img');
                    links.push({ link: '', img: img.src });
                }
                return links;
            });
        }

        let response2 = [];
        if (mas) {
            await page.goto(config.STOCK[1], [1000, { waitUntil: "domcontentloaded" }]);
            if (texto != '') {
                await page.type('.search input', texto)
                await page.click('.search button');
            }
            await page.waitForSelector('.wookmark-initialised');
            await autoScroll(page);
            response2 = await page.evaluate(() => {
                const elements = document.querySelectorAll('.wookmark-initialised a');
                const links = [];
                for (let element of elements) {
                    const img = element.querySelector('img');
                    links.push({ link: element.href, img: img.src });
                }
                return links;
            });
        }
        // await page.screenshot({ path: `${global.appRoot}/public/${guid}.png`, fullPage: true });
        // await page.screenshot({ path: `${global.appRoot}/src/${guid}.png` });
        await brower.close();
        console.log("Respondido");
        return [...response1, ...response2];

    },

    async detail(url) {

        console.log("buscando...");

        const brower = await puppeteer.launch({
            args: [
                '--no-sandbox', '--disable-setuid-sandbox'
            ]
        });
        const page = await brower.newPage();
        await page.setViewport({ width: 1920, height: 1080 });

        let response = [];
        await page.goto(url, [1000, { waitUntil: "domcontentloaded" }]);
        await page.waitForSelector('.wookmark-initialised');
        await autoScroll(page);
        response = await page.evaluate(() => {
            const elements = document.querySelectorAll('.wookmark-initialised a');
            const links = [];
            for (let element of elements) {
                const img = element.querySelector('img');
                links.push({ link: element.href, img: img.src });
            }
            return links;
        });
        await brower.close();
        console.log("Respondido");
        return response;
    }

}

const autoScroll = async (page) => {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            var time = 0;
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if ((totalHeight >= scrollHeight - window.innerHeight) || time == 10000) {
                    clearInterval(timer);
                    resolve();
                }
                time = time + 100;

            }, 100);
        });
    });
}

module.exports = service;