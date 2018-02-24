const path = require('path')
const Koa = require('koa')
const views = require('koa-views')
const koaStatic = require('koa-static')
const bodyParser = require('koa-bodyparser')
const koaLogger = require('koa-logger')
const log4js = require('log4js')
const session = require('koa-session-minimal')
const MysqlStore = require('koa-mysql-session')
const config = require('./../config')
const routers = require('./routers/index')
const oauthserver = require('koa-oauth-server')
const model_oauth = require('koa-oauth-server/node_modules/oauth2-server/examples/memory/model')
const mount = require('koa-mount')
const Router = require('koa-router')
const cors = require('koa2-cors')
const app = new Koa()
const router = new Router()

const sessionMysqlConfig = {
  user: config.database.USERNAME,
  password: config.database.PASSWORD,
  database: config.database.DATABASE,
  host: config.database.HOST,
  port: config.database.PORT,
}
app.use(cors({
  origin: function(ctx){
    console.log('origin ctx url=',ctx.url)
    if(ctx.url.match('/api/')){
      console.log(ctx.url.match('/api/'))
      return "*";//允许来自所有的域名请求
    }
    return 'http://localhost:3002';
  },
  exposeHeaders:['WWW-Authenticate','Server-Authorization'],
  maxAge: 5,
  credentials:true,
  allowMethods:['GET','POST','PATCH','DELETE'],
  allowHeaders:['Content-Type','Authorization','Accept'],
}))

app.use(session({
  key:'USER_SID',
  store:new MysqlStore(sessionMysqlConfig)
}))

app.use(koaLogger())
log4js.configure(config.log)
var logger = log4js.getLogger('common')
global.logger = logger;
app.use(bodyParser({
  formLimit:'3mb',
  jsonLimit:'10mb',
  textLimit:'3mb',
}))

app.oauth = oauthserver({
  model: model_oauth,
  grants: ['password'],
  debug: true
});

// Mount `oauth2` route prefix.
//app.use(mount('/oauth2', router.middleware()));

// Register `/token` POST path on oauth router (i.e. `/oauth2/token`).
//router.get('/token', app.oauth.grant());

app.use(koaStatic(path.join(__dirname,'./../static')))
app.use(views(path.join(__dirname,'./views'),{extension:'ejs'}))
app.use(routers.routes()).use(routers.allowedMethods())

app.listen(config.port)
console.log(`the server is start at port ${config.port}`)
