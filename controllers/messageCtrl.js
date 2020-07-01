const controller = require('./controller');
const moment = require('moment');
const lodash = require('lodash');
const notificationService = require('../libs/service/notificationService');
const socketService = require('../libs/service/socketService');
const config = require('../config/app.json');
const fs = require('fs');
const path = require('path');
var basename = path.basename(__filename);
const download = require("downloadjs");
const cryptoRandomString = require('crypto-random-string');


module.exports = class messageCtrl extends controller {
    constructor(ctx) {
        super(ctx);
        this.ctx = ctx;
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
        let type = this.getInput('type')
        if(type == "image"){
            validate = await this.validate(this.getBody(), {
                'path': 'required',
                'fileContent': 'required',
            }, {
                'path.required': 'path không được bỏ trống',
                'fileContent.required': 'fileContent không được bỏ trống'
            });
        }

        if (validate.fails()) {
            return this.response(validate.messages(), 422);
        }
        let userId = this.getInput('userId')
        
        let typeData = this.getInput('typeData')
        let content = this.getInput('content')
        let email = this.getInput('email')
        let roomId = this.getInput('roomId')
        let fConvertFilePath;
        if(type == "image"){
            let fPath = this.getInput('path')
            let fContent = this.getInput('fileContent')
            content = await this.uploadFile(fPath, fContent)
            
        }
        try {
            //thuc hien them tin nhan vao csdl
            let articleId;
            if(type == "image"){
                articleId = await this.insertMessage(userId, type, typeData, content, email, roomId);
            }else{
                articleId = await this.insertMessage(userId, type, typeData, content, email, roomId);
            }
            
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
            await this.socketService.sendMessage(email, listEmailOfRoomId, roomId, content, articleId, type);

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
                },
                type
            );

            return this.response({ status: true })
        } catch (error) {
            console.log(error)
            return this.response({ status: false }, 500)
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

    /**
     * Upload file
     */
    async uploadFile(fPath, fContent) {
        try {
            let pathFile = cryptoRandomString({length: 20}) + "." + fPath;
            let fileContent = fContent;
            fileContent = fileContent.replace(/^data:image\/png;base64,/, "");

            let filePath = path.join(__dirname, '..','libs','upload','message') + "/" + pathFile;
            fs.writeFileSync(filePath, fileContent, 'base64', function(err) {
                console.log(err);
            });

            return pathFile;
        } catch (error) {
            console.log(error)
            return false;
        }

    }

    async getFile(fileName){
        let filePath = path.join(__dirname, '..','libs','upload','message') + "/" + fileName;
        try {
            if (fs.existsSync(filePath)) {
              this.ctx.body = fs.createReadStream(filePath);
              this.ctx.attachment(filePath);
            } else {
                this.ctx.throw(400, "Requested file not found on server");
            }
          } catch(error) {
            this.ctx.throw(500, error);
          }  
        
    }

}