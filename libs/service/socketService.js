const axios = require('axios');
const config = require('../../config/app.json');

class socketService {
    constructor() {
        this.uri = config.service.socket.uri;
        let user = config.service.socket.authen.user;
        let pass = config.service.socket.authen.pass;
        this.header = {
            'Authorization': 'Basic ' + Buffer.from(user + ":" + pass).toString('base64'),
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        }
    }

    sendMessage(emailSend, emailReceive, topicId, body, articleId, type) {
        let url = this.uri + '/api/v1/sendMessage';
        let postData = {
            "emailSend": emailSend,
            "emailReceive": emailReceive,
            "body": body || "",
            "topicId": topicId,
            "articleId" : articleId,
            "typeMessage": type
        }
        return axios.post(url, postData, { headers: this.header });
    }
}

module.exports = socketService;
