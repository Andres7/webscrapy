var envJSON = require('../env.variables.json');
var node_env = process.env.NODE_ENV || 'development';
var config = envJSON[node_env];
module.exports = {
    config: config,
};