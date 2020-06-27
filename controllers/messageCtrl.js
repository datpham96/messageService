const controller = require('./controller');
const moment = require('moment');
const lodash = require('lodash');
const messageType = require('../libs/config/listType/messageType');

module.exports = class messageCtrl extends controller {
    constructor(ctx) {
        super(ctx);
        // this.ctx = ctx;
    }

    /**
     * Thuc hien them moi message
     */
    async insertMessage() {
        //validate
        let validate = await this.validate(this.getBody(), {
            'userId': 'required',
            'email': 'required|email',
            'type': 'required'
        }, {
            'userId.required': 'Id không được bỏ trống',
            'email.required': 'Email không được bỏ trống',
            'type.required': 'Type không được bỏ trống',
            'email.email': 'email không đúng định dạng'
        });

        if (validate.fails()) {
            this.response(validate.messages(), 422);
            return false;
        }
        let userId = this.getInput('userId')
        let type = this.getInput('type')
        let typeData = this.getInput('typeData')
        let content = this.getInput('content')
        let email = this.getInput('email')
        try {
            //thuc hien insert
            let newMessage = await this.messageModel.create({
                'userId': userId,
                'type': type,
                'typeData': typeData,
                'content': content,
                'email': email
            });

            this.response({ status: true, id: newMessage.id });

        } catch (error) {
            this.response({ status: false }, 422);
        }
    }
}