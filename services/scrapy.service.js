const puppeteer = require('puppeteer');
const { v4: uuidv4 } = require('uuid');
const { config } = require('../helpers/config');

const service = {

    hello() {
        return "Hola domun"
    },

    async search(texto, mas, espera) {
        const guid = uuidv4();

        console.log("buscando...", mas);

        const brower = await puppeteer.launch({
            args: [
                '--no-sandbox', '--disable-setuid-sandbox'
            ]
        });
        const page = await brower.newPage();

        let response1 = [];
        if (!mas) {
            await page.goto(config.STOCK[0]);

            await page.type('.header__search-form__flex-wrap input', texto)
            await page.click('.header__search-form__flex-wrap button');
            await page.waitForSelector('.photo-grid')
            await page.waitForTimeout(espera);
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
            if (texto != '') {
                await page.type('.search input', texto)
                await page.click('.search button');
            }
            await page.waitForSelector('.wookmark-initialised');
            await page.waitForTimeout(espera);
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


    async detail(url, espera) {

        console.log("buscando...");

        const brower = await puppeteer.launch({
            args: [
                '--no-sandbox', '--disable-setuid-sandbox'
            ]
        });
        const page = await brower.newPage();

        let response = [];
        await page.goto(`${config.STOCK[1]}${url}`);
        await page.waitForSelector('.wookmark-initialised');
        await page.waitForTimeout(espera);
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
module.exports = service;