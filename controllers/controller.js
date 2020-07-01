const db = require('../models');
const validate =  require('../libs/MyValidate');
const myFunc = require('../libs/myFunc');
const MessageSchema = require('../libs/mongodb/models/schema/messageSchema')
const RoomSchema = require('../libs/mongodb/models/schema/roomSchema')
const inviteSchema = require('../libs/mongodb/models/schema/inviteSchema')

module.exports = class controller{
    constructor(ctx){
        this.model = db;
        this.validate = validate;
        this.ctx = ctx;
        this.myFunc = myFunc;
        this.messageModel = MessageSchema;
        this.roomModel = RoomSchema;
        this.inviteModel = inviteSchema;
        this.userInfo = this.ctx.header.userInfo;
    }
    
    response(data, status, header){
        data = data || {};
        status = status || 200;
        header = header || {};

        this.ctx.body = data;
        this.ctx.status = status;
    }

    getParam(key){
        return this.ctx.request.query[key];
    }

    getBody(){
        return this.ctx.request.body;
    }

    getInput(key, defaultVal){
        defaultVal = defaultVal || '';
        return this.ctx.request.body[key] || defaultVal;
    }

    getData(){
        return (this.ctx.request.method == 'GET')? this.ctx.request.query: this.ctx.request.body;
    }
}