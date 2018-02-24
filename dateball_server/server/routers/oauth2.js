const Router = require('koa-router')
const model_oauth = require('koa-oauth-server/node_modules/oauth2-server/examples/memory/model')
const NodeOAuthServer = require('oauth2-server')
const AccessDeniedError = require('oauth2-server/lib/errors/access-denied-error')
const InvalidGrantError = require('oauth2-server/lib/errors/invalid-grant-error')
const router = new Router()

const oauth = new NodeOAuthServer({
  model: model_oauth,
});

function handleError(err, server, ctx) {
    ctx.type = 'json';
    ctx.status = err.code;

    if (err.headers)
      ctx.set(err.headers);

    ctx.body = {};
    ['code', 'error', 'error_description'].forEach(function (key) {
      ctx.body[key] = err[key];
    });

    err.type = 'oauth';
}

async function oauthToken(ctx){
    const Request = NodeOAuthServer.Request
    const Response = NodeOAuthServer.Response

    //console.log('request:',ctx.request)
    //console.log('response:',ctx.response)
    let req_option = {}
    let res_option = {}
    req_option.headers = ctx.request.header
    req_option.method = ctx.request.method
    req_option.query = ctx.request.url
    req_option.body = ctx.request.body

    let request = new Request(req_option)
    let response = new Response(res_option)

    await oauth.token(request, response)
        .then((token) => {
        // The resource owner granted the access request.
        console.log("the token is :", token)
        ctx.body = token
      })
      .catch((err) => {
        // The request was invalid or not authorized.
        if (err instanceof AccessDeniedError) {
          // The resource owner denied the access request.
          console.log('The resource owner denied the access request.')
        } if(err instanceof InvalidGrantError) {
          console.log('Invalid grant error.')
        }else {
          // Access was not granted due to some other error condition.
          console.log('Access was not granted due to some other error condition.')
        }

        handleError(err, oauth, ctx);
      })

      //model_oauth.dump()
}

async function oauthAuthenticate(ctx){
  const Request = NodeOAuthServer.Request
  const Response = NodeOAuthServer.Response

  let req_option = {}
  let res_option = {}
  req_option.headers = ctx.request.header
  req_option.method = ctx.request.method
  req_option.query = ctx.request.url
  req_option.body = ctx.request.body

  let request = new Request(req_option)
  let response = new Response(res_option)

  await oauth.authenticate(request, response)
      .then((token) => {
      // The resource owner granted the access request.
      console.log("the authenticate token is :", token)
      ctx.body = token
    })
    .catch((err) => {
      // The request was invalid or not authorized.
      if (err instanceof AccessDeniedError) {
        // The resource owner denied the access request.
        console.log('The resource owner denied the access request.')
      } if(err instanceof InvalidGrantError) {
        console.log('Invalid grant error.')
      }else {
        // Access was not granted due to some other error condition.
        console.log('Access was not granted due to some other error condition.')
      }

      handleError(err, oauth, ctx);
    })

    //model_oauth.dump()
}

async function oauthAuthorize(ctx){
  const Request = NodeOAuthServer.Request
  const Response = NodeOAuthServer.Response

  let req_option = {}
  let res_option = {}
  req_option.headers = ctx.request.header
  req_option.method = ctx.request.method
  req_option.query = ctx.request.url
  req_option.body = ctx.request.body

  let request = new Request(req_option)
  let response = new Response(res_option)

  await oauth.authorize(request, response)
      .then((code) => {
      // The resource owner granted the access request.
      console.log("the authorize code is :", code)
      ctx.body = code
    })
    .catch((err) => {
      // The request was invalid or not authorized.
      if (err instanceof AccessDeniedError) {
        // The resource owner denied the access request.
        console.log('The resource owner denied the access request.')
      } if(err instanceof InvalidGrantError) {
        console.log('Invalid grant error.')
      }else {
        // Access was not granted due to some other error condition.
        console.log('Access was not granted due to some other error condition.')
      }

      handleError(err, oauth, ctx);
    })

    //model_oauth.dump()
}

const routers = router
  .post('/token', oauthToken)
  .post('/authenticate',oauthAuthenticate)
  .post('/authorize', oauthAuthorize)

module.exports = routers
