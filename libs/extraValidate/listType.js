const messageType = require('../config/listType/messageType');

module.exports = {
    messageStatus: async (value) => {
        return messageType.existType([value]);
    },
    existEmail: (arrEmail, email) => {
        return messageType.existEmail(arrEmail, email);
    } 
}