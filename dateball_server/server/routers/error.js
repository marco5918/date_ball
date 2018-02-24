const Router = require('koa-router')

const router = new Router()

module.exports = router.get('*', async(ctx) =>{
  const title = 'error'
  await ctx.render('error',{
    title
  })
})
