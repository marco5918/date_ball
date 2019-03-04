/***
 * 球场业务操作
 */

const validator = require('validator')
const courtCode = require('./../codes/court')
const MeModel = require('./../models/me')
const HobbyBasketballInfoModel = require('./../models/hobby_basketball_info')
const PkModel = require('./../models/pk')
const CourtModel = require('./../models/court')
const Sequelize = require('sequelize')
const { or, and, gt, lt } = Sequelize.Op;
const _ = require('lodash')

MeModel.hasOne(HobbyBasketballInfoModel, { onDelete: 'cascade', hooks: true })
CourtModel.hasMany(PkModel)
PkModel.belongsTo(CourtModel)
MeModel.hasMany(CourtModel, { onDelete: 'cascade', hooks: true })
CourtModel.belongsTo(MeModel, { onDelete: 'cascade', hooks: true })

const court = {
    /**
     * 获取自己添加的球队列表资料
     * @param {string} meid 我的id
     * @return {object | null} 查找球队列表信息
     */
    async getCourtList(meid) {

        let resultData = {};
        let meModelArr = await MeModel.findById(meid)

        if (meModelArr != null) {
            resultData.me = meModelArr
            resultData.me_court = [];

            let courtModelArr = await meModelArr.getCourts()
            if (courtModelArr !== null && courtModelArr.length > 0) {
                for (let i = 0; i < courtModelArr.length; i++) {
                    resultData.me_court.push(courtModelArr[i]);
                }

            } else {
                return resultData
            }

        } else {
            return resultData
        }

        return resultData
    },

    /**
     * 创建球场
     * @param {object} court 球场信息
     * @return {object} 创建结果
     */
    async createCourt(court) {
        let result = {}
        await PkModel.create(court).then(function(court_obj) {
            console.log("court_obj create : ", court_obj.get({ 'plain': true }))
            result.id = court_obj.get("id")
            result.success = true;
        }).catch(function(err) {
            result.success = false;
            console.log("court_obj create error: " + err.message)
        })

        return result
    },
}

module.exports = court