const crypto = require("crypto");
const appConfig = require("../config/app.json");
const replaceAll = require('replaceall');

module.exports = {
    isEmpty: (val) => {
        if (!val)
            return true;
        var typeOfVal = typeof val;
        var retVal = false;
        switch (typeOfVal) {
            case 'array':
                retVal = (val.length < 1) ? true : false;
                break;
            case 'object':
                var arrKey = Object.keys(val);
                retVal = (arrKey.length < 1) ? true : false;
                break;
            case 'string':
                retVal = (val.length < 1) ? true : false;
                break;
        }

        return retVal;
    },
    makehash: (val) => {
        return crypto.createHmac('sha256', appConfig.appKey).update(val).digest('hex');
    },
    replace: (str, find, replace) => {
        return replaceAll(find, replace, str);
    },
    decryptData: (data) => {
        let iv = new Buffer(data.substring(0, 32), 'hex');
        let dec = crypto.createDecipheriv('aes-256-cbc', appConfig.encryptKey, iv);
        let decrypted = Buffer.concat([dec.update(new Buffer(data.substring(32), 'base64')), dec.final()]);
        return JSON.parse(decrypted.toString());
    },
};