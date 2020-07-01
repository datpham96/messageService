const axios = require('axios');
const config = require('../../config/app.json');

class notificationService {
    constructor() {
        this.uri = config.service.notification.uri;
        let user = config.service.notification.authen.user;
        let pass = config.service.notification.authen.pass;
        this.header = {
            'Authorization': 'Basic ' + Buffer.from(user + ":" + pass).toString('base64'),
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        }
    }

    sendMessage(emailSend, emailReceive, title, body, icon, clickAction, data, typeMessage) {
        let url = this.uri + '/api/v1/sendMessage';
        let postData = {
            "emailSend": emailSend,
            "emailReceive": emailReceive,
            "title": title,
            "body": body || "",
            "icon": icon || "",
            "clickAction": clickAction,
            "data": data,
            "type": "device",
            "typeMessage": typeMessage,
        }

        return axios.post(url, postData, { headers: this.header });
    }
}

module.exports = notificationService;
