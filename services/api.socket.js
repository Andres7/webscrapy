const { v4: uuidv4 } = require('uuid');
const io = global.io;
const srv = require('../services/scrapy.service');

io.on('connection', (socket) => {


    //IDENTIFICAR USUARIO
    socket.on('startet', async (data, callback) => {
        socket.identi = uuidv4();
        console.log("Usuario conectado", socket.identi);
        callback({ guid: socket.identi })
    });

    // RECIBIR MENSAJE
    socket.on('search', async (data) => {
        console.log("buscando...", data);
        await srv.search(data, socket);
        console.log("Respondido");
        // socket.emit('response', { status: true, data: { data: null, end: true } });
    });

    socket.on('detail', async (data) => {
        console.log("buscando...");
        await srv.detail(data, socket);
        console.log("Respondido");
        // socket.emit('response', { status: true, data: { data: null, end: true } });

    });

    //USUARIO DESCONECTADO
    socket.on('disconnect', () => {
        console.log("Usuario desconectado: ", socket.identi);
    });

});
