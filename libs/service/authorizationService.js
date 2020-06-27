const config = require('../../config/app.json')
const axios = require('axios')

class authorizationService{
    constructor() {
        let user = config.service.authorization.user;
        let pass = config.service.authorization.pass;
        this.uri = config.service.authorization.uri;
        this.header = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8',
            'Authorization': 'Basic ' + Buffer.from(user + ":" + pass).toString('base64'),
        }
    }

    getUserInfo(){
        let url = this.uri + '/api/v1/user/listUser';
        return axios.get(url, { headers: this.header});
    }

}

module.exports = authorizationService;