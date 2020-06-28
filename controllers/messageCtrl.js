const controller = require('./controller');
const moment = require('moment');
const lodash = require('lodash');
const notificationService = require('../libs/service/notificationService');
const socketService = require('../libs/service/socketService');
const config = require('../config/app.json');


module.exports = class messageCtrl extends controller {
    constructor(ctx) {
        super(ctx);
        // this.ctx = ctx;
        this.notificationService = new notificationService();
        this.socketService = new socketService();
    }

    /**
     * thuc hien tao va gui tin nhan cho nguoi dung theo roomId
     */
    async index() {
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
        let roomId = this.getInput('roomId')
        try {
            //thuc hien them tin nhan vao csdl
            let articleId = await this.insertMessage(userId, type, typeData, content, email, roomId);
            //get list email trong room
            let getInfoRoom = await this.roomModel.findOne({
                roomId: roomId
            });
            
            let listEmailOfRoomId = getInfoRoom.email;
            const index = listEmailOfRoomId.indexOf(email);
            if (index > -1) {
                listEmailOfRoomId.splice(index, 1);
            }
            
            //send socket
            await this.socketService.sendMessage(email, listEmailOfRoomId, roomId, content, articleId);

            // send notificationService
            await this.notificationService.sendMessage(
                email, listEmailOfRoomId, 'Tin nhắn', content,
                config.service.notification.icon,
                false,
                {
                    title: 'Tin nhắn',
                    type: config.service.notification.clickAction.newConversation,
                    topicId: roomId,
                    articleId: articleId,
                    emailSender: email,
                }
            );

            return this.response({ status: true })
        } catch (error) {
            return this.response({ status: false }, 422)
        }
    }

    /**
     * Thuc hien them moi message
     */
    async insertMessage(userId, type, typeData, content, email, roomId) {
        try {
            //thuc hien insert
           let respData = await this.messageModel.create({
                'userId': userId,
                'type': type,
                'typeData': typeData,
                'content': content,
                'email': email,
                'roomId': roomId
            });
            if(respData){
                return respData._id;
            }
           

        } catch (error) {
            return false;
        }
    }
}