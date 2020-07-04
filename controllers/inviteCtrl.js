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

    //add invite
    async addInvite(){
        //validate
        let validate = await this.validate(this.getBody(), {
            'roomId': 'required',
            'email': 'required|email',
        }, {
            'roomId.required': 'roomId không được bỏ trống',
            'email.required': 'Email không được bỏ trống',
            'email.email': 'email không đúng định dạng'
        });

        if (validate.fails()) {
            return this.response(validate.messages(), 422);
        }
        let roomId = this.getInput('roomId')
        let email = this.getInput('email')
        //check room
        let getInfoRoom = await this.roomModel.findOne({
            roomId: roomId
        })

        //check invite
        let getInfoInvite = await this.inviteModel.findOne({
            email: email
        })
        if(getInfoInvite){
            return this.response({ status: false, errMsg: "Bạn đã mời người này trước đó" }, 422);
        }

        if(!getInfoRoom){
            return this.response({ status: false, errMsg: "Thông tin phòng không xác địng" }, 422);
        }

        try {
             //thuc hien insert
             let respData = await this.inviteModel.create({
                'roomId': roomId,
                'name': getInfoRoom.name,
                'email': email
            });

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
                email: email
            });
            if(respData){
                return this.response(respData);
            }
        } catch (error) {
            return this.response({ status: false }, 500);
        }
    }

    //kiem tra loi moi ket ban
    async checkInvite(email, roomId){
        try {
             //thuc hien insert
            let respData = await this.inviteModel.findOne({
                roomId: roomId,
                email: email
            });
            if(respData){
                return this.response({ status: false, errMsg: "Bạn đã mời người này rồi" }, 422);
            }

            return this.response({ status: true })
        } catch (error) {
            return this.response({ status: false }, 500);
        }
    }

}