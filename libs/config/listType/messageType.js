const underscore = require('underscore');

let type = {
    message: {
        text: 'text',
        image: 'image'
    }
};

const messageType = {
    'CONST_TYPE_TEXT': type.message.text,
    'CONST_TYPE_IMAGE': type.message.image,
    'listMessageType': [
        {
            code: type.message.text,
            name: "Text"
        },
        {
            code: type.message.image,
            name: "Image"
        },
       
    ],
    existType: (arrStatus) => {
        let listMessageCode = underscore.pluck(messageType.listMessageType, 'code');
        let result = true;
        underscore.each(arrStatus, (item, key) => {
            if(listMessageCode.indexOf(item) == -1){
                result = false;
            }
        });
        return result;
    },
    existEmail: (arrEmail, email) => {
        let result = true;
        if(arrEmail.indexOf(email) == -1){
            result = false;
        }
        return result;
    }
}

module.exports = messageType;