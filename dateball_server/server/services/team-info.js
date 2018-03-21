/***
 * 用户业务操作
 */

const validator = require('validator')
const teamCode = require('./../codes/team')
const MeModel = require('./../models/me')
const HobbyBasketballInfoModel = require('./../models/hobby_basketball_info')
const TeamModel = require('./../models/team')
const PlayerModel = require('./../models/player')
const Sequelize = require('sequelize')
const {or, and, gt, lt} = Sequelize.Op;
const _ = require('lodash')

MeModel.hasOne(HobbyBasketballInfoModel)
HobbyBasketballInfoModel.belongsTo(MeModel)
MeModel.hasOne(PlayerModel)
PlayerModel.belongsTo(MeModel)
TeamModel.hasMany(PlayerModel)
PlayerModel.belongsTo(TeamModel)

const team = {

    /**
     * 检查球队数据
     * @param {object} teamInfo 球队数据
     * @return {object} 校验结果
     */

    async validatorTeamInfo(teamInfo){

        let result = {
            success: false,
            message: '',
        }

        if(teamInfo.team_name !== undefined && !validator.isLength(teamInfo.team_name,{min:1,max:32})){
            result.message = teamCode.ERROR_TEAM_NAME
            return result
        }

        result.success = true
        return result
    },

    /**
    * 查找存在球队信息
    * @param {object} formData 查找的表单数据
    * @return {object|null} 查找结果
    */

    async getTeamExistOne( formData){
        let resultData = null;
        let teamModelArr = null;
 
        teamModelArr = await TeamModel.findAll({
            where: {
                'team_name': formData.team_name
            }
        })

        if(teamModelArr != null && teamModelArr.length > 0){
            resultData = teamModelArr[0]
        }

        return resultData
    },

    /**
     * 创建球队
     * @param {object} team 球队信息
     * @return {object} 创建结果
     */
    async create(team){
        let result = {}
        await TeamModel.create(team).then(function(team_obj){
            console.log("team create : ",team_obj.get({'plain': true}))
            result.id = team_obj.get("id")
            result.success = true;
        }).catch(function(err){
            result.success = false;
            console.log("team create error: "+err.message)
        })

        return result
    },
    
    /**
    * 更新球队信息
    * @param {object} team 球队信息
    * @return {object} 更新结果
    */
    async update(team){
        let result = {}
        result.success = false

        if(team.id !== undefined){
            let team_info = await TeamModel.findById(team.id)
            if(team_info !== null){
                console.log("team info get by id : ",team_info.get({'plain': true}))
                await team_info.update(team).then(function(team_res){
                    result.success = true;
                    console.log("team update : ",team_res.get({'plain': true}))
                }).catch(function(err){
                    result.success = false
                    console.log("team update error: "+err.message)
                })
            }
        }

        return result
    },

    /**
      * 根据球队名称查找球队信息业务操作
      * @param {string} teamName 球队名称
      * @return {object | null} 查找结果
      */
    async getTeamInfoByTeamName(teamName){
        let resultData = {};

        let teamModelArr = await TeamModel.findAll({
          where: {
            'team_name': teamName,
          }
        })

        if(teamModelArr !== null && teamModelArr.length > 0){
            resultData.team = teamModelArr[0]
        }

        return resultData
    },

    /**
     * 根据球队id查找球队业务操作
     * @param {string} id 球队id
     * @return {object | null} 查找结果
     */
    async getTeamInfoById(id){
        let resultData = {};

        let teamModelInfo = await TeamModel.findById(id)

        if(teamModelInfo != null){
            resultData.team = teamModelInfo
        }

        return resultData
    },

    /**
     * 获取所有球队列表资料
     * 
     */
    async getTeamList(){

        let resultData = [];

        let teamModelArr = await TeamModel.findAll()
        if(teamModelArr !== null && teamModelArr.length > 0){
           for(let i = 0; i<teamModelArr.length; i++){
             let data = teamModelArr[i]
             resultData.push(data)
           }
        }

        return resultData
    },

    /**
     * 获取所有球队列表资料
     * @param {string} teamId 球队id
     * @return {object | null} 查找球队所有成员信息
     */
    async getPlayerList(teamId){
        let resultData = [];

        let playerModelArr = await PlayerModel.findAll({
          where: {
            'teamId': teamId,
          }
        })

        if(playerModelArr !== null && playerModelArr.length > 0){
            let result = {}
            result.player = playerModelArr[0]
            result.me = result.player.getMe()
            result.hobby = result.me.getHobby_basketball_info()
            resultData.push(result)
        }

        return resultData
    },

     /**
     * 根据球员id查找球员信息
     * @param {string} id 球员id
     * @return {object | null} 查找结果
     */
    async getPlayerInfoById(id){
        let resultData = {};

        let playerModelInfo = await PlayerModel.findById(id)

        if(playerModelInfo != null){
            resultData.player = playerModelInfo
            resultData.me = resultData.player.getMe()
            resultData.hobby = resultData.me.getHobby_basketball_info()
        }

        return resultData
    },

    /**
     * 根据球员id查找球员信息
     * @param {obj} formData 表单信息
     * @return {object | null} 查找结果
     */
    async getPlayerExistOne(formData){
        let resultData = null;
        let playerModelArr = null;
 
        playerModelArr = await PlayerModel.findAll({
            where: {
                [and]: [
                    {'teamId': formData.team_id},
                    {'meId': formData.me_id}
                  ]
            }
        })

        if(playerModelArr != null && playerModelArr.length > 0){
            resultData = playerModelArr[0]
        }

        return resultData
    },

    /**
     * 创建球队
     * @param {object} player 球员信息
     * @return {object} 创建结果
     */
    async createPlayer(player){
        let result = {}
        await PlayerModel.create(player).then(function(player_obj){
            console.log("player create : ",player_obj.get({'plain': true}))
            result.id = player_obj.get("id")
            result.success = true;
        }).catch(function(err){
            result.success = false;
            console.log("player create error: "+err.message)
        })

        return result
    },

    /**
     * 更新球员信息
     * @param {object} player 球员信息
     * @return {object} 更新结果
     */
    async updatePlayerInfo(player){
        let result = {}
        result.success = false

        if(player.id !== undefined){
            let player_info = await PlayerModel.findById(player.id)
            if(player_info !== null){
                console.log("player info get by id : ",player_info.get({'plain': true}))
                let updateData = {}

                if(player.new_points !== undefined && player.new_rebound !== undefined
                    && player.new_assist !== undefined){
                        updateData.game_count = player_info.get('game_count')+1
                }

                if(player.team_title !== undefined){
                    updateData.team_title = player.team_title
                }

                if(player.status !== undefined){
                    updateData.status = player.status
                }
                         
                if(player.new_points !== undefined){

                    updateData.total_points = player_info.get('total_points') + player.new_points 
                    updateData.avg_points = _.round(_.divide(updateData.total_points, updateData.game_count), 1)
                }
                    
                if(player.new_rebound !== undefined){
                    updateData.total_rebound = player_info.get('total_rebound') + player.new_rebound
                    updateData.avg_rebound =  _.round(_.divide(updateData.total_rebound, updateData.game_count), 1)
                }
                   
                if(player.new_assist !== undefined){
                    updateData.total_assist = player_info.get('total_assist') + player.new_assist
                    updateData.avg_assist = _.round(_.divide(updateData.total_assist, updateData.game_count), 1)
                }

                if(player.new_block !== undefined){
                    updateData.total_block = player_info.get('total_block') + player.new_block
                    updateData.avg_block = _.round(_.divide(updateData.total_block, updateData.game_count), 1)
                }

                if(player.new_steal !== undefined){
                    updateData.total_steal = player_info.get('total_steal') + player.new_steal
                    updateData.avg_steal = _.round(_.divide(updateData.total_steal, updateData.game_count), 1)
                }

                if(player.new_three_point_hit !== undefined){
                    updateData.total_three_point_hit = player_info.get('total_three_point_hit') + player.new_three_point_hit
                    updateData.avg_three_point_hit = _.round(_.divide(updateData.total_three_point_hit, updateData.game_count), 1)
                }
                
                if(player.increase_scoring_leader !== undefined)
                    updateData.scoring_leader = player_info.get('scoring_leader') + 1

                if(player.increase_rebound_leader !== undefined)
                    updateData.rebound_leader =  player_info.get('rebound_leader') + 1

                if(player.increase_assisting_leader !== undefined)
                    updateData.assisting_leader = player_info.get('assisting_leader') + 1

                if(player.increase_blocking_leader !== undefined)
                    updateData.blocking_leader = player_info.get('blocking_leader') + 1

                if(player.increase_stealing_leader !== undefined)
                    updateData.stealing_leader = player_info.get('stealing_leader') + 1

                
                await player_info.update(updateData).then(function(player_res){
                    result.success = true;
                    console.log("player update : ",player_res.get({'plain': true}))
                }).catch(function(err){
                    result.success = false
                    console.log("player update error: "+err.message)
                })
            }
        }

        return result
    },


}

module.exports = team
