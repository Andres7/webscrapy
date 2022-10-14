const { v4: uuidv4 } = require('uuid');
const io = global.io;

const puppeteer = require('puppeteer');
// const { v4: uuidv4 } = require('uuid');
const { config } = require('../helpers/config');

const autoScroll = async (page) => {
    return await page.evaluate(async () => {
        var totalHeight = 0;
        var distance = 250;
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        return totalHeight >= scrollHeight - window.innerHeight ? true : false;
    });
}

io.on('connection', (socket) => {

    socket.identi = uuidv4();
    console.log("Usuario conectado", socket.identi);

    // RECIBIR MENSAJE
    socket.on('search', async (mensaje) => {

        console.log("buscando...", mensaje.mas);
        const brower = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await brower.newPage();
        await page.setViewport({ width: 1920, height: 1080 });
        if (!mensaje.mas) {
            await page.goto(config.STOCK[0], [1000, { waitUntil: "domcontentloaded" }]);
            await page.type('.header__search-form__flex-wrap input', mensaje.texto)
            await page.click('.header__search-form__flex-wrap button');
            await page.waitForSelector('.photo-grid');
            await page.evaluate(async () => {
                const elements = document.querySelectorAll('.photo-grid a');
                for (let element of elements) {
                    const img = element.querySelector('img');
                    const data = { link: '', img: img.src };
                    socket.emit('response', { status: true, data: { data, end: false } });
                    await autoScroll(page);
                }
            });
        }

        if (mensaje.mas) {
            await page.goto(config.STOCK[1], [1000, { waitUntil: "domcontentloaded" }]);
            if (texto != '') {
                await page.type('.search input', mensaje.texto)
                await page.click('.search button');
            }
            await page.waitForSelector('.wookmark-initialised');
            await page.evaluate(async () => {
                const elements = document.querySelectorAll('.wookmark-initialised a');
                for (let element of elements) {
                    const img = element.querySelector('img');
                    const data = { link: element.href, img: img.src };
                    socket.emit('response', { status: true, data: { data, end: false } });
                    await autoScroll(page);
                }
            });
        }
        await brower.close();
        console.log("Respondido");
        socket.emit('response', { status: true, data: { data: null, end: true } });
    });

    socket.on('detail', async (mensaje) => {

        console.log("buscando...");
        const brower = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await brower.newPage();
        await page.setViewport({ width: 1920, height: 1080 });
        await page.goto(mensaje.url, [1000, { waitUntil: "domcontentloaded" }]);
        await page.waitForSelector('.wookmark-initialised');
        await page.evaluate(async () => {
            const elements = document.querySelectorAll('.wookmark-initialised a');
            for (let element of elements) {
                const img = element.querySelector('img');
                links.push({ link: element.href, img: img.src });
                socket.emit('response', { status: true, data: { data, end: false } });
                await autoScroll(page);
            }
        });
        await brower.close();
        console.log("Respondido");
        socket.emit('response', { status: true, data: { data: null, end: true } });

    });

    //USUARIO DESCONECTADO
    socket.on('disconnect', () => {
        console.log("Usuario desconectado: ", socket.identi);
    });

});
