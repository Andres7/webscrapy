var router = require('express').Router();
const cntrl = require('../controllers/scrapy.controllers');

router
    .post('/search', cntrl.search)
    .post('/detail', cntrl.detail)
    .get('/', cntrl.hello)

module.exports = router;