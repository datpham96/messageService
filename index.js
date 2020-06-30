const Koa = require("koa");
const app = new Koa();
require('./libs/mongodb/mongo')()

const appConfig = require('./config/app.json');
const route = require('./routes/api');
const bodyParse = require('koa-bodyparser');

global.basePath = __dirname;
if (appConfig.showLog) {
    const logger = require('koa-logger');
    app.use(logger());
}

app.use(bodyParse());
app.use(route.apiRouter.routes());
app.use(route.apiRouterBasicAuth.routes());
app.use(route.fileRouter.routes());

app.listen(appConfig.port, ()=>{
    console.log('port ' + appConfig.port)
});