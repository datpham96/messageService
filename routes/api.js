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

//lay danh sach room theo user current
apiRouter.get('/room', async ctx => { await new roomCtrl(ctx).listRoom() });

//moi user vao room theo email va roomId
apiRouter.post('/addRoom', async ctx => { await new roomCtrl(ctx).addRoom() })

//remove user ra khoi room theo email va roomId
apiRouter.post('/outRoom', async ctx => { await new roomCtrl(ctx).outRoom() })

//basic authen
apiRouterBasicAuth.use(koaBasicAuth(config.basicAuthen));
//tao room khi tao user
apiRouterBasicAuth.post('/room', async ctx => { await new roomCtrl(ctx).createRoom() });

module.exports = {
    apiRouter,
    apiRouterBasicAuth
};