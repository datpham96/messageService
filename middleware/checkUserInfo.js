const myFunc = require('../libs/myFunc');
const checkUserInfo = async (ctx, next) => {
    try {
        let encryptUser = ctx.headers.encryptuser;
        let userInfo = myFunc.decryptData(encryptUser);
        if(userInfo === false || !userInfo.id){
            ctx.body = { status: false, errCode: 'EncryptUser' };
            ctx.status = 422;
            return false;
        }
        ctx.request.header = {...ctx.request.header, userInfo: userInfo};
    } catch (error) {
        ctx.body = { status: false, errCode: 'EncryptUser' };
        ctx.status = 422;
        return false;
    }

    await next();
}

module.exports = checkUserInfo;