const Router = require('koa-router')
const controller = require('./../controllers/work')

const router = new Router()
const routers = router.get('/',controller.indexPage)

module.exports = routers
