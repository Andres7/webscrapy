const srv = require('../services/scrapy.service');

const control = {

    hello(req, res) {
        res.send(srv.hello());
    },

    async search(req, res) {
        try {
            const response = await srv.search(req.body.texto, req.body.mas);
            res.status(200).send({ status: true, data: response });
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: false, dara: error });
        }
    },

    async detail(req, res) {
        try {
            const response = await srv.detail(req.body.url);
            res.status(200).send({ status: true, data: response });
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: false, dara: error });
        }
    }
}
module.exports = control;