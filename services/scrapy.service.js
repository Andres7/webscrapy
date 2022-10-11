const puppeteer = require('puppeteer');
const { v4: uuidv4 } = require('uuid');
const { config } = require('../helpers/config');

const service = {

    hello() {
        return "Hola domun"
    },

    async search(texto, mas) {
        const guid = uuidv4();

        console.log("buscando...", mas);

        const brower = await puppeteer.launch();
        const page = await brower.newPage();

        let response1 = [];
        if (!mas) {
            await page.goto(config.STOCK[0]);

            await page.type('.header__search-form__flex-wrap input', texto)
            await page.click('.header__search-form__flex-wrap button');
            await page.waitForSelector('.photo-grid')
            await page.waitForTimeout(500);
            response1 = await page.evaluate(() => {
                const elements = document.querySelectorAll('.photo-grid a');
                const links = [];
                for (let element of elements) {
                    const img = element.querySelector('img');
                    links.push(img.src);
                }
                return links;
            });
        }

        let response2 = [];
        if (mas) {
            await page.goto(config.STOCK[1]);
            await page.type('.search input', texto)
            await page.click('.search button');
            await page.waitForSelector('.wookmark-initialised');
            await page.waitForTimeout(5000);
            response2 = await page.evaluate(() => {
                const elements = document.querySelectorAll('.wookmark-initialised a');
                const links = [];
                for (let element of elements) {
                    const img = element.querySelector('img');
                    links.push(img.src);
                }
                return links;
            });
        }
        // await page.screenshot({ path: `${global.appRoot}/public/${guid}.png`, fullPage: true });
        // await page.screenshot({ path: `${global.appRoot}/src/${guid}.png` });
        await brower.close();
        console.log("Respondido");
        return [...response1, ...response2];

    }

}
module.exports = service;