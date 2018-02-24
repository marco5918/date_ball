const userInfoService = require('./../services/user-info')
const userCode = require('./../codes/user')
const uploadFile = require('./../utils/upload')
const passport = require('../utils/passport')
const log4js = require('log4js')
const Sequelize = require('sequelize')

module.exports = {

  async signIn(ctx){
    let formData = ctx.request.body
    let result = {
      success: false,
      message: '',
      data: null,
      code:''
    }

    let userResult = await userInfoService.signIn(formData)
    if(userResult){
      if(userResult instanceof Sequelize.Model && (formData.phone === userResult.get('phone') || formData.login_user === userResult.get('login_user'))){
        result.success = true
      }else{
        result.message = userCode.FAIL_USER_NAME_OR_PASSWORD_ERROR
        result.code = 'FAIL_USER_NAME_OR_PASSWORD_ERROR'
      }
    }else{
      result.code = 'FAIL_USER_NO_EXIST',
      result.message =  userCode.FAIL_USER_NO_EXIST
    }

    if(formData.source === 'form' && result.success === true){
      let session = ctx.session
      session.isLogin = true
      session.loginUser = userResult.get('login_user')
      session.phone = userResult.get('phone')
      session.userId = userResult.get('id')
      ctx.redirect('/home')
    }else{
      ctx.body = result
    }
  },

  async signUp(ctx){
    let formData = ctx.request.body
    let result = {
      success: false,
      message: '',
      data: null
    }
    var logger = log4js.getLogger('common')

    let validateResult = await userInfoService.validatorSignUp(formData)
    if(validateResult.success === false){
      result = validateResult
      ctx.body = result
      logger.error("signUp validateResult:",result)
      return
    }

    let existOne = await userInfoService.getExistOne(formData)

    if(existOne){
      if(existOne.login_user == formData.login_user){
        result.message = userCode.FAIL_USER_NAME_IS_EXIST
        ctx.body = result
        logger.error("signUp existOne login_user:",result)
        return
      }

      if(existOne.phone == formData.phone){
        result.message = userCode.FAIL_PHONE_IS_EXIST
        ctx.body = result
        logger.error("signUp existOne phone:",result)
        return
      }
    }
    const hashPassword = await passport.encrypt(formData.password)
    let userResult = await userInfoService.create({
      phone: formData.phone,
      favicon: (formData.favicon != null) ? formData.favicon : '',
      password: hashPassword,
      name: formData.name,
      nick_name: formData.nick_name,
      city: formData.city,
      age: formData.age,
      gender: formData.gender,
      job: formData.job,
      hobby: formData.job,
      login_user: formData.login_user,
      create_time: new Date().getTime(),
      modified_time: new Date().getTime(),
      last_login_time: new Date().getTime(),
    },{
        height: formData.height,
        weight: formData.weight,
        jersey_number: formData.jersey_number,
        position: formData.position,
        nba_team: formData.nba_team,
        love_star: formData.love_star,
        strong_point: formData.strong_point,
    })

    if(userResult && userResult.success){
      result.success = true
    }else{
      result.code = 'ERROR_SYS'
      result.message = userCode.ERROR_SYS
    }
    logger.error("signUp:",result)
    ctx.body = result
  },

  async updateUserInfo(ctx){
    let formData = ctx.request.body
    let result = {
      success: false,
      message: '',
      data: null
    }

    let validateResult = await userInfoService.validatorSignUp(formData, true)

    if(validateResult.success === false){
      result = validateResult
      ctx.body = result
      return
    }

    let existOne = await userInfoService.getExistOne(formData, true)
    if(existOne){
      if(existOne.phone === formData.phone){
        result.message = userCode.FAIL_PHONE_IS_EXIST
        ctx.body = result
        return
      }
    }

    let me = {}
    if(formData.phone !== undefined)
      me.phone = formData.phone
    if(formData.favicon !== undefined)
      me.favicon = formData.favicon
    if(formData.password !== undefined){
      const hashPassword = await passport.encrypt(formData.password)
      me.password = hashPassword
    }

    if(formData.name !== undefined)
      me.name = formData.name
    if(formData.nick_name !== undefined)
      me.nick_name = formData.nick_name
    if(formData.city !== undefined)
      me.city = formData.city
    if(formData.age !== undefined)
      me.age = formData.age
    if(formData.gender !== undefined)
      me.gender = formData.gender
    if(formData.job !== undefined)
      me.job = formData.job
    if(formData.hobby !== undefined)
      me.hobby = formData.hobby
    if(formData.login_user !== undefined)
      me.login_user = formData.login_user
    if(formData.id !== undefined)
    {
      me.id = formData.id
      me.modified_time = new Date().getTime()
    }

    let hobby_info = {}
    if(formData.height !== undefined)
      hobby_info.height = formData.height
    if(formData.weight !== undefined)
      hobby_info.weight = formData.weight
    if(formData.jersey_number !== undefined)
      hobby_info.jersey_number = formData.jersey_number
    if(formData.position !== undefined)
      hobby_info.position = formData.position
    if(formData.nba_team !== undefined)
      hobby_info.nba_team = formData.nba_team
    if(formData.love_star !== undefined)
      hobby_info.love_star = formData.love_star
    if(formData.strong_point !== undefined)
      hobby_info.strong_point = formData.strong_point
    if(formData.hobby_id !== undefined)
      hobby_info.id = formData.hobby_id


    let userResult = await userInfoService.update(me,hobby_info)
    if(userResult && userResult.success){
      result.success = true
    }else{
      result.code = 'ERROR_SYS'
      result.message = userCode.ERROR_SYS
    }

    ctx.body = result
  },

  async getLoginUserInfo(ctx){
    let session = ctx.session
    let isLogin = session.isLogin
    let loginUser = session.loginUser
    let phone = session.phone

    console.log('session=', session)

    let result = {
      success: false,
      message: '',
      data: null,
    }

    isLogin = true;
    loginUser = null;
    phone = null;
    const {id} = ctx.query;


    if( isLogin === true && (loginUser || phone) ){
      let userInfo = await userInfoService.getUserInfoByLoginUserAndPhone(loginUser, phone)
      if(userInfo && userInfo.me){
        result.data = userInfo
        result.success = true
      }else{
        result.code = 'FAIL_USER_NO_LOGIN'
        result.message = userCode.FAIL_USER_NO_LOGIN
      }
    }else if(id !== null){
      let userInfo = await userInfoService.getUserInfoById(id)
      //console.log("userinfo:",userInfo)
      if(userInfo && userInfo.me){
        result.data = userInfo
        result.success = true
      }else{
        result.code = 'FAIL_USER_NO_LOGIN'
        result.message = userCode.FAIL_USER_NO_LOGIN
      }
    }

    ctx.body = result
  },

  async validateLogin(ctx){
    let result = {
      success: false,
      message: userCode.FAIL_USER_NO_LOGIN,
      data: null,
      code: 'FAIL_USER_NO_LOGIN',
    }
    let session = ctx.session
    if(session && session.isLogin === true){
      resut.success = true
      result.message = ''
      result.code = ''
    }
    return result
  },

  async uploadHeadshot(ctx){
      let result = { success: false }
      // 上传文件事件
      result = await uploadFile(ctx, {
          pictureType: 'headshot',
      })
      ctx.body = result
  },

  async getUserList(ctx){
    let session = ctx.session
    let isLogin = true //session.isLogin
    let loginUser = null //session.loginUser
    let phone = null//session.phone

    console.log('session=', session)

    let result = {
      success: false,
      message: '',
      data: null,
    }

    if( isLogin === true){
      let userInfo = await userInfoService.getUserList()
      if(userInfo){
        result.data = userInfo
        result.success = true
        let count = result.data !== null ? result.data.length : 0
        ctx.set("x-total-count", count);
      }else{
        result.code = 'FAIL_USER_NO_LOGIN'
        result.message = userCode.FAIL_USER_NO_LOGIN
      }
    }else{

    }
    
    ctx.body = result
  },

}
