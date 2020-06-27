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
    async listRoom() {
        try {
            let listRoom = await this.roomModel.find();
            let emailCurent = this.userInfo.email;
            let arrRoom = [];
            if(listRoom){
                lodash.each(listRoom, function(item){
                    if(messageType.existEmail(item.email, emailCurent)){
                        arrRoom.push(item);
                    }
                });
            }
            
            this.response(arrRoom);
        } catch (error) {
            console.log(error);
        }

    }

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
            this.response(validate.messages(), 422);
            return false;
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

            this.response({ status: true, id: newRoom.id });
        } catch (error) {
            
        }
    }
}