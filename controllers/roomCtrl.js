const controller = require('./controller');
const moment = require('moment');
const lodash = require('lodash');
const messageType = require('../libs/config/listType/messageType');

module.exports = class roomCtrl extends controller {
    constructor(ctx) {
        super(ctx);
        // this.ctx = ctx;
    }

    /**
     * Lay danh sach room by current user
     */
    async roomDetail(roomId){
        try {
            let listMessage = await this.messageModel.find({
                roomId: roomId
            })

            return this.response(listMessage);

        } catch (error) {
            return this.response({ status: false }, 500);
        }
    }

    /**
     * Lay danh sach room by current user
     */
    async listRoom(email) {
        try {
            let listRoom = await this.roomModel.find();
            let emailCurent = (email) ? email : this.userInfo.email;
            let arrRoom = [];
            if(listRoom){
                lodash.each(listRoom, function(item){
                    if(messageType.existEmail(item.email, emailCurent)){
                        arrRoom.push(item);
                    }
                });
            }
            
            return this.response(arrRoom);
        } catch (error) {
            return this.response({ status: false }, 500);
        }
    }

    //create room
    async createRoom(){
        //validate
        let validate = await this.validate(this.getBody(), {
            'email': 'required|email',
            'name': 'required'
        }, {
            'email.required': 'Email không được bỏ trống',
            'email.email': 'email không đúng định dạng',
            'name.required': 'Tên không được bỏ trống'
        });

        if (validate.fails()) {
            return this.response(validate.messages(), 422);
        }
        let name = this.getInput('name')
        let email = this.getInput('email')
        try {
            //insert room
            let newRoom = await this.roomModel.create({
                name: name,
                roomId: email,
                email: [email]
            })

            return this.response({ status: true, id: newRoom.id });
        } catch (error) {
            return this.response({ status: false,}, 500);
        }
    }

    //add email to room by roomId
    async addRoom() {
        //validate
        let validate = await this.validate(this.getBody(), {
            'email': 'required|email',
            'roomId': 'required'
        }, {
            'email.required': 'Email không được bỏ trống',
            'email.email': 'email không đúng định dạng',
            'roomId.required': 'roomId không được bỏ trống'
        });

        if (validate.fails()) {
            return this.response(validate.messages(), 422);
        }

        let roomId = this.getInput('roomId')
        let email = this.getInput('email')

        let userInfo = this.userInfo;
        if(userInfo.email != roomId){
            return this.response({ status: false, errMsg: "Bạn không có quyền thực hiện chức năng này" }, 422);
        }

        if(userInfo.email == email){
            return this.response({ status: false, errMsg: "Bạn không thể mời chính mình" }, 422);
        }
        try {
            let getInfoRoom = await this.roomModel.findOne({
                roomId: roomId
            })
            let arrEmail = getInfoRoom.email;
            const index = arrEmail.indexOf(email);
            if (index > -1) {
                return this.response({ status: false, errMsg: "Người dùng đã có trong phòng" }, 422);
            }
            arrEmail.push(email);
            getInfoRoom.email = arrEmail;
            getInfoRoom.save();

            return this.response({ status: true }, 200);
        } catch (error) {
            return this.response({ status: false }, 500);
            console.log(error);
        }
    }

    //moi ra khoi room
    async outRoom(){
        //validate
        let validate = await this.validate(this.getBody(), {
            'email': 'required|email',
            'roomId': 'required'
        }, {
            'email.required': 'Email không được bỏ trống',
            'email.email': 'email không đúng định dạng',
            'roomId.required': 'roomId không được bỏ trống'
        });

        if (validate.fails()) {
            return this.response(validate.messages(), 422);
        }

        let roomId = this.getInput('roomId');
        let email = this.getInput('email');
        let userInfo = this.userInfo;
        if(userInfo.email == email){
            return this.response({ status: false, errMsg: "Bạn không thể đá chính mình" }, 422);
        }
        try {
            let getInfoRoom = await this.roomModel.findOne({
                roomId: roomId
            })
            let arrEmail = getInfoRoom.email;
            const index = arrEmail.indexOf(email);
            if (index > -1) {
                arrEmail.splice(index, 1);
            }else{
                return this.response({ status: false, errMsg: "Người dùng không tồn tại" }, 422);
            }
            getInfoRoom.email = arrEmail;
            getInfoRoom.save();

            return this.response({ status: true }, 200);
        } catch (error) {
            return this.response({ status: false }, 500);
            console.log(error);
        }
    }
}