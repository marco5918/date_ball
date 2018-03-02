/***
 * 用户业务操作
 */

 const validator = require('validator')
 const userCode = require('./../codes/user')
 const MeModel = require('./../models/me')
 const Sequelize = require('sequelize')
 const HobbyBasketballInfoModel = require('./../models/hobby_basketball_info')
 const {or, and, gt, lt} = Sequelize.Op;
 const passport = require('../utils/passport')
 const _ = require('lodash')
 MeModel.hasOne(HobbyBasketballInfoModel)
 HobbyBasketballInfoModel.belongsTo(MeModel)

 const user = {

   /**
    * 创建用户
    * @param {object} user 用户信息
    * @param {object} hobby 篮球信息
    * @return {object} 创建结果
    */

    async create( user , hobby){
      let result = {}
      let me = null

      await MeModel.create(user).then(function(me_obj){
        me = me_obj
        console.log("me create : ",me_obj.get({'plain': true}))
        result.id = me.get("id")
        result.login_user = me.get("login_user")
        result.success = true;
      }).catch(function(err){
        result.success = false;
        console.log("me create error: "+err.message)
      })

      me != null && await me.createHobby_basketball_info(hobby).then(function(hobby_res){
        console.log("hobby create : ",hobby_res.get({'plain': true}))
      }).catch(function(err){
        result.success = false;
        console.log("hobby create error: "+err.message)
      })
      return result
    },

    /**
     * 更新用户信息
     * @param {object} user 用户信息
     * @param {object} hobby 篮球信息
     * @return {object} 更新结果
     */
     async update(user, hobby){
        let result = {}

        if(hobby.id !== undefined){
          let hobby_info = await HobbyBasketballInfoModel.findById(hobby.id)
          if(hobby_info != null){
            console.log("hobby get by id : ",hobby_info.get({'plain': true}))
            await hobby_info.update(hobby).then(function(hobby_res){
              result.success = true;
              console.log("hobby update : ",hobby_res.get({'plain': true}))
            }).catch(function(err){
              result.success = false
              console.log("hobby update error: "+err.message)
            })
          }
        }

        if(user.id !== undefined){
          let user_info = await MeModel.findById(user.id)
          if(user_info != null){
            await user_info.update(user).then(function(me_res){
              if(hobby.id === undefined){
                  result.success = true
              }
              console.log("me update : ", me_res.get({'plain': true}))
            }).catch(function(err){
              result.success = false
              console.log("me update error: ", err.message)
            })
          }
        }

        return result
     },

    /**
     * 查找存在用户信息
     * @param {object} formData 查找的表单数据
     * @param {bool} bUpdate 是否是更新
     * @return {object|null} 查找结果
     */

     async getExistOne( formData , bUpdate){
       let resultData = null;
       let meModelArr = null;
       if(bUpdate){
         meModelArr = await MeModel.findAll({
           where: {
               'login_user': formData.login_user
           }
         })
       }else{
         meModelArr = await MeModel.findAll({
           where: {
             [or]: [
               {'phone': formData.phone},
               {'login_user': formData.login_user}
             ]
           }
         })
       }


       if(meModelArr != null && meModelArr.length > 0){
           resultData = meModelArr[0]
       }

       return resultData
     },

     /**
      * 登录业务操作
      * @param {object} formData 登录表单信息, password, phone or login_user
      * @return {object} 登录业务操作结果
      */
      async signIn(formData){
        console.log('signIn:',formData)
        let password = formData.password
        let phone = formData.phone !== undefined ? formData.phone : ''
        let name = formData.login_user !== undefined ? formData.login_user : ''
        let resultData = null;

        let meModelArr = await MeModel.findAll({
          where: {
            [or]: [
              {'phone': phone},
              {'login_user': name}
            ]
          }
        })

        //console.log('meModelArr:',meModelArr)
        if(meModelArr != null && meModelArr.length > 0){
            console.log('hash password:',meModelArr[0].get('password'))
            const passwordSame = await passport.validate(password,meModelArr[0].get('password'))
            console.log('passwordSame:',passwordSame)
            if(passwordSame){
              resultData = meModelArr[0]
            }else{
              resultData = {passwordSame:true}
            }
        }

        return resultData
      },

      /**
       * 根据用户名和电话号码查找用户业务操作
       * @param {string} userName 用户名
       * @param {string} phone 电话号
       * @return {object | null} 查找结果
       */
       async getUserInfoByLoginUserAndPhone( loginUser, phone ){
         let resultData = {};

         let meModelArr = await MeModel.findAll({
           where: {
             'phone': phone,
             'login_user': loginUser
           }
         })

         if(meModelArr != null && meModelArr.length > 0){
             resultData.me = meModelArr[0]
             resultData.hobby_info = await meModelArr[0].getHobby_basketball_info()
         }

         return resultData
       },
       /**
       * 根据用户id查找用户业务操作
       * @param {string} id 用户id
       * @return {object | null} 查找结果
       */
       async getUserInfoById( id ){
         let resultData = {};

         let meModelArr = await MeModel.findById(id)

         if(meModelArr != null){
             resultData.me = meModelArr
             resultData.hobby_info = await meModelArr.getHobby_basketball_info()
         }

         return resultData
       },
       

       /**
        * 检查用户注册数据
        * @param {object} userInfo 用户注册数据
        * @param {bool} bUpdate 是否是更新
        * @return {object} 校验结果
        */
        async validatorSignUp( userInfo , bUpdate){
          let result = {
            success: false,
            message: '',
          }

          if(userInfo.loginUser !== undefined && /[a-zA-Z0-9\_\-]{6,16}/.test(userInfo.loginUser) === false){
            result.message = userCode.ERROR_USER_NAME
            return result
          }
          if(userInfo.phone !== undefined && !validator.isMobilePhone(userInfo.phone,'zh-CN')){
            result.message = userCode.ERROR_Phone
            return result
          }

          if(!bUpdate){
            if(!/[\w+]{6,16}/.test(userInfo.password)){
              result.message = userCode.ERROR_PASSWORD
              return result
            }
            if(userInfo.password !== userInfo.password_confirm){
              result.message = userCode.ERROR_PASSWORD_CONFORM
              return result
            }
          }else{
            if(userInfo.password !== undefined){
              if(!/[\w+]{6,16}/.test(userInfo.password)){
                result.message = userCode.ERROR_PASSWORD
                return result
              }

              if(userInfo.password !== userInfo.password_confirm){
                result.message = userCode.ERROR_PASSWORD_CONFORM
                return result
              }
            }
          }

          result.success = true
          return result
        },
        /**
       * 获取所有用户资料
       * 
       */
       async getUserList(){
         let resultData = [];

         let meModelArr = await MeModel.findAll()
         if(meModelArr != null && meModelArr.length > 0){
            for(let i = 0; i<meModelArr.length; i++){
              let data = meModelArr[i]
              let hobby_info = await data.getHobby_basketball_info()
              let data_hobby_info = _.assign({}, data.dataValues, hobby_info.dataValues)
              resultData.push(data_hobby_info)
            }
         }

         return resultData
       },

 }

module.exports = user
