const Router = require("koa-router");
const messageCtrl = require('../controllers/messageCtrl');
const roomCtrl = require('../controllers/roomCtrl');
const mdwAddHeaderJson = require('../middleware/apiHeaderResponse');
const checkUserInfo = require('../middleware/checkUserInfo');
const koaBasicAuth = require("koa-basic-auth");
const config = require("../config/app.json")

let apiRouter = new Router({
    prefix: '/api/v1'
});

let apiRouterBasicAuth = new Router({
    prefix: '/api/v1'
});

apiRouter.use(mdwAddHeaderJson);
apiRouter.use(checkUserInfo);

apiRouterBasicAuth.use(mdwAddHeaderJson);

//thuc hien insert va gui tin nhan
apiRouter.post('/sendMessage', async ctx => { await new messageCtrl(ctx).index() });

//upload file
apiRouter.post('/upload/file', async ctx => { await new messageCtrl(ctx).uploadFile() });

//lay danh sach room theo user current
apiRouter.get('/user/room', async ctx => { await new roomCtrl(ctx).listRoom() });

//lay danh message theo roomId
apiRouter.get('/user/room/:roomId', async ctx => { await new roomCtrl(ctx).roomDetail(ctx.params.roomId) });

//moi user vao room theo email va roomId
apiRouter.post('/user/addRoom', async ctx => { await new roomCtrl(ctx).addRoom() });

//remove user ra khoi room theo email va roomId
apiRouter.post('/user/outRoom', async ctx => { await new roomCtrl(ctx).outRoom() });

//basic authen
apiRouterBasicAuth.use(koaBasicAuth(config.basicAuthen));
//tao room khi tao user
apiRouterBasicAuth.post('/room', async ctx => { await new roomCtrl(ctx).createRoom() });

//lay danh sach room theo email
apiRouterBasicAuth.get('/user/roomBasic/:email', async ctx => { await new roomCtrl(ctx).listRoom(ctx.params.email) });

module.exports = {
    apiRouter,
    apiRouterBasicAuth
};