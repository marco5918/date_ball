const Router = require('koa-router')
const index = require('../controllers/index')

const router = new Router()
module.exports = router.get('/', index)
