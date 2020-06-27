const Router = require("koa-router");
const messageCtrl = require('../controllers/messageCtrl');
const roomCtrl = require('../controllers/roomCtrl');
const mdwAddHeaderJson = require('../middleware/apiHeaderResponse');
const checkUserInfo = require('../middleware/checkUserInfo');

let apiRouter = new Router({
    prefix: '/api/v1'
});

let apiRouterBasicAuth = new Router({
    prefix: '/api/v1'
});

apiRouter.use(mdwAddHeaderJson);
apiRouter.use(checkUserInfo);

apiRouterBasicAuth.use(mdwAddHeaderJson);

apiRouter.get('/room', async ctx => { await new roomCtrl(ctx).listRoom() });
apiRouter.post('/message', async ctx => { await new messageCtrl(ctx).insertMessage() });

//basic authen
apiRouterBasicAuth.use(koaBasicAuth(config.basicAuthen));
apiRouterBasicAuth.post('/room', async ctx => { await new roomCtrl(ctx).createRoom() });

module.exports = {
    apiRouter,
    apiRouterBasicAuth
};