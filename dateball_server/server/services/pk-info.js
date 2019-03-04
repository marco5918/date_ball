/***
 * 训练挑战业务操作
 */

const validator = require('validator')
const pkCode = require('./../codes/pk')
const MeModel = require('./../models/me')
const HobbyBasketballInfoModel = require('./../models/hobby_basketball_info')
const TeamModel = require('./../models/team')
const PlayerModel = require('./../models/player')
const PkModel = require('./../models/pk')
const CourtModel = require('./../models/court')
const Sequelize = require('sequelize')
const { or, and, gt, lt } = Sequelize.Op;
const _ = require('lodash')

MeModel.hasOne(HobbyBasketballInfoModel, { onDelete: 'cascade', hooks: true })
HobbyBasketballInfoModel.belongsTo(MeModel, { onDelete: 'cascade', hooks: true })
MeModel.hasMany(PlayerModel, { onDelete: 'cascade', hooks: true })
PlayerModel.belongsTo(MeModel, { onDelete: 'cascade', hooks: true })
TeamModel.hasMany(PlayerModel, { onDelete: 'cascade', hooks: true })
PlayerModel.belongsTo(TeamModel, { onDelete: 'cascade', hooks: true })
CourtModel.hasMany(PkModel)
PkModel.belongsTo(CourtModel)
MeModel.hasMany(CourtModel, { onDelete: 'cascade', hooks: true })
CourtModel.belongsTo(MeModel, { onDelete: 'cascade', hooks: true })

const pk = {
    /**
     * 获取所有自己球队训练和挑战列表资料
     * @param {string} meid 我的id
     * @return {object | null} 查找球队列表信息
     */
    async getPkList(meid) {

        let resultData = {};
        let meModelArr = await MeModel.findById(meid)

        if (meModelArr != null) {
            resultData.me = meModelArr
            resultData.team_pk = [];

            let playerModelArr = await meModelArr.getPlayers()
            if (playerModelArr !== null && playerModelArr.length > 0) {

                let team_id_array = [];
                let map_team_id_title = [];
                for (let i = 0; i < playerModelArr.length; i++) {
                    let team_pks_obj = {};
                    let data = playerModelArr[i]
                    if (data.status !== 1) {
                        continue;
                    }

                    team_id_array.push(data.teamId);
                    map_team_id_title.push({ 'team_id': data.teamId, 'team_title': data.team_title })
                }

                if (team_id_array.length > 0) {

                    let pkModelArr = await PkModel.findAll({
                        where: {
                            [or]: [
                                { 'select_self_team': team_id_array },
                                { 'select_pk_team': team_id_array },
                            ]
                        }
                    })

                    if (pkModelArr !== null && pkModelArr.length > 0) {
                        for (let j = 0; j < pkModelArr.length; j++) {
                            let team_pks_obj;
                            let pkInfoModal = pkModelArr[j];
                            team_pks_obj.pk = pkInfoModal;
                            let courtInfoMeModal = await pkInfoModal.getCourt();
                            team_pks_obj.court = courtInfoMeModal;
                            let selfTeamModel = await TeamModel.findById(team_pks_obj.pk.select_self_team);
                            let bflag = false;
                            if (selfTeamModel !== null) {
                                map_team_id_title.map((map_team_id_title) => {
                                    if (map_teamid_title.team_id === myTeamModel.id) {
                                        team_pks_obj.my_team = myTeamModel;
                                        team_pks_obj.my_team_title = map_teamid_title.team_title;
                                        bflag = true;
                                        return null;
                                    }
                                });

                                if (!bflag) {
                                    team_pks_obj.pk_team = selfTeamModel;
                                }
                            }

                            if (team_pks_obj.pk.pk_type === 2) {

                                let pkTeamModel = await TeamModel.findById(team_pks_obj.pk.select_pk_team);
                                if (pkTeamModel !== null) {
                                    if (bflag) {
                                        team_pks_obj.pk_team = pkTeamModel;
                                    } else {
                                        map_team_id_title.map((map_team_id_title) => {
                                            if (map_teamid_title.team_id === pkTeamModel.id) {
                                                team_pks_obj.my_team = pkTeamModel;
                                                team_pks_obj.my_team_title = map_teamid_title.team_title;
                                                return null;
                                            }
                                        });
                                    }

                                }

                            }
                        }

                    }

                    resultData.team_pk.push(team_pks_obj);
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
     * 创建球队训练或者挑战
     * @param {object} pk PK信息
     * @return {object} 创建结果
     */
    async createPk(pk) {
        let result = {}
        await PkModel.create(pk).then(function(pk_obj) {
            console.log("pk_obj create : ", pk_obj.get({ 'plain': true }))
            result.id = pk_obj.get("id")
            result.success = true;
        }).catch(function(err) {
            result.success = false;
            console.log("pk_obj create error: " + err.message)
        })

        return result
    },
}

module.exports = pk