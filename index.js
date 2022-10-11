const express = require('express');
const cors = require("cors");
const path = require('path');
var { config } = require('./helpers/config.js');
const port = config.PORT;

global.appRoot = path.resolve(__dirname);

//INICIAMOS EXPRESS
const app = express();
app.use(cors({ origin: '*' }));
app.use(express.urlencoded({ extended: true, limit: '550mb', parameterLimit: 55000000 }));
app.use(express.json({ limit: '550mb' }));

app.use('/rec', express.static(path.join(__dirname, '/public')));


app.use('/', require('./routes/scrapy.route'));

const http = require('http').createServer(app);
http.listen(port, () => { console.log(`Listen: ${port}`); });
http.setTimeout(60000000);