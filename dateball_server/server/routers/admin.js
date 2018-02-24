const Router = require('koa-router')
const admin = require('./../controllers/admin')

const router = new Router()

module.exports = router.get('/', admin.indexPage)
