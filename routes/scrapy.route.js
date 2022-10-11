var router = require('express').Router();
const cntrl = require('../controllers/scrapy.controllers');

router
    .post('/api/search', cntrl.search)
    .get('/', cntrl.hello)

module.exports = router;