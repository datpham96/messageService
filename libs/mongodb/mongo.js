const config = require('../../config/app.json');
const configMongo = require('./config/type')
let mongoose = require('mongoose');

const url = config.mongodbConfig.host + ":" + config.mongodbConfig.port

module.exports = function () {
    mongoose.connect(url + "/" + configMongo.database.name)
        .then(() => {
            console.log('Database mongo connection successful')
        })
        .catch(err => {
            console.error('Database mongo connection error')
        })
    mongoose.set('useFindAndModify', false);
};