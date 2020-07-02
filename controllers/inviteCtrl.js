const controller = require('./controller');
const moment = require('moment');
const lodash = require('lodash');
const messageType = require('../libs/config/listType/messageType');
const socketService = require('../libs/service/socketService')

module.exports = class inviteCtrl extends controller {
    constructor(ctx) {
        super(ctx);
        // this.ctx = ctx;
        this.socketService = new socketService();
    }

    async index(){
        //validate
        let validate = await this.validate(this.getBody(), {
            'roomId': 'required',
            'email': 'required|email',
            'name': 'required'
        }, {
            'roomId.required': 'roomId không được bỏ trống',
            'email.required': 'Email không được bỏ trống',
            'name.required': 'name không được bỏ trống',
            'email.email': 'email không đúng định dạng'
        });

        if (validate.fails()) {
            return this.response(validate.messages(), 422);
        }
            
        try {
             //thuc hien insert
            let respData = await this.inviteModel.create({
                'roomId': roomId,
                'name': name,
                'email': email
            });

            //gui qua socket
            await this.socketService.inviteUser(email, roomId, name);

            if(respData){
                return this.response({ status: true, id: respData._id }, 200);
            }
        } catch (error) {
            return this.response({ status: false }, 500);
        }
    }

    //danh sách lời mời vào room
    async listInvite(email){
        
        try {
             //thuc hien insert
            let respData = await this.inviteModel.find({
                'email': email
            });
            if(respData){
                return this.response(respData);
            }
        } catch (error) {
            return this.response({ status: false }, 500);
        }
    }

}