var router = require('express').Router();
const cntrl = require('../controllers/scrapy.controllers');

router
    .post('/api/search', cntrl.search)
    .post('/api/detail', cntrl.detail)
    .get('/', cntrl.hello)

module.exports = router;