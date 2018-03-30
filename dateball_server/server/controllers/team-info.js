const teamInfoService = require('./../services/team-info')
const teamCode = require('./../codes/team')
const uploadFile = require('./../utils/upload')
const passport = require('../utils/passport')
const log4js = require('log4js')
const Sequelize = require('sequelize')
const moment = require('moment')

module.exports = {

  async createTeam(ctx){
    let formData = ctx.request.body
    let result = {
      success: false,
      message: '',
      data: null
    }
    var logger = log4js.getLogger('common')

    let validateResult = await teamInfoService.validatorTeamInfo(formData)
    if(validateResult.success === false){
      result = validateResult
      ctx.body = result
      logger.error("createTeam validateResult:",result)
      return
    }

    let existOne = await teamInfoService.getTeamExistOne(formData)

    if(existOne){
      if(existOne.team_name == formData.team_name){
        result.message = teamCode.FAIL_TEAM_NAME_IS_EXIST
        ctx.body = result
        logger.error("createTeam existOne team_name:",result)
        return
      }
    }

    let teamResult = await teamInfoService.create({
      team_name: formData.team_name,
      team_logo: (formData.team_logo != null) ? formData.team_logo : '',
      team_city: (formData.team_city !== undefined) ? formData.team_city : '',
      team_info: (formData.team_info !== undefined) ? formData.team_info : '',
      match_num: (formData.match_num !== undefined) ?  formData.match_num: 0,
      train_num:  (formData.train_num !== undefined) ?  formData.train_num: 0,
      winning_rate:  (formData.winning_rate !== undefined) ? formData.winning_rate : 0,
    })

    if(teamResult && teamResult.success){
      result.success = true
      result.data = {};
      result.data.id = teamResult.id
      result.data.team_name = teamResult.team_name
    }else{
      result.code = 'ERROR_SYS'
      result.message = teamCode.ERROR_SYS
    }
    logger.error("createTeam:",result)
    ctx.body = result
  },

  async updateTeamInfo(ctx){
    let formData = ctx.request.body
    let result = {
      success: false,
      message: '',
      data: null
    }

    let validateResult = await teamInfoService.validatorTeamInfo(formData)

    if(validateResult.success === false){
      result = validateResult
      ctx.body = result
      return
    }

    let existOne = await teamInfoService.getTeamExistOne(formData, true)
    if(existOne){
      if(existOne.team_name === formData.team_name){
        result.message =  teamCode.FAIL_TEAM_NAME_IS_EXIST
        ctx.body = result
        return
      }
    }

    let team = {}
    if(formData.team_name !== undefined)
        team.team_name = formData.team_name
    if(formData.team_logo !== undefined)
        team.team_logo = formData.team_logo
    if(formData.team_city !== undefined)
        team.team_city = formData.team_city
    if(formData.team_info !== undefined)
        team.team_info = formData.team_info
    if(formData.match_num !== undefined)
        team.match_num = formData.match_num
    if(formData.train_num !== undefined)
        team.train_num = formData.train_num
    if(formData.winning_rate !== undefined)
        team.winning_rate = formData.winning_rate
    
    if(formData.id !== undefined)
    {
        team.id = formData.id
    }

    let teamResult = await teamInfoService.update(team)
    if(teamResult && teamResult.success){
      result.success = true
    }else{
      result.code = 'ERROR_SYS'
      result.message = teamCode.ERROR_SYS
    }

    ctx.body = result
  },

  async getTeamInfo(ctx){

    let result = {
      success: false,
      message: '',
      data: null,
    }

    const {id, team_name} = ctx.query;


    if(team_name){
      let teamInfo = await teamInfoService.getTeamInfoByTeamName(team_name)
      if(teamInfo){
        result.data = teamInfo
        result.success = true
      }else{
        result.code = 'FAIL_TEAM_NO_EXIST'
        result.message = teamCode.FAIL_TEAM_NO_EXIST
      }
    }else if(id !== null){
      let teamInfo = await teamInfoService.getTeamInfoById(id)
      if(teamInfo){
        result.data = teamInfo
        result.success = true
      }else{
        result.code = 'FAIL_TEAM_NO_EXIST'
        result.message = teamCode.FAIL_TEAM_NO_EXIST
      }
    }else{
        result.code = 'FAIL_TEAM_NO_EXIST'
        result.message = teamCode.FAIL_TEAM_NO_EXIST
    }

    ctx.body = result
  },

  async uploadTeamLogo(ctx){
      let result = { success: false }
      // 上传文件事件
      result = await uploadFile(ctx, {
          pictureType: 'teamlogo',
      })
      ctx.body = result
  },

  async removeTeam(ctx){

  },

  async joinTeam(ctx){

  },

  async outTeam(ctx){

  },

  async getTeamList(ctx){

        let result = {
            success: false,
            message: '',
            data: null,
        }

        const {meid} =  ctx.query
        if(meid !== null){
            let teamList = await teamInfoService.getTeamList(meid)
            if(teamList){
                result.data = teamList
                result.success = true
            }else{
                result.code = 'FAIL_NO_TEAM'
                result.message = teamCode.FAIL_NO_TEAM
            }
        }else{
            result.code = 'FAIL_NO_TEAM'
            result.message = teamCode.FAIL_NO_TEAM
        }
        
        ctx.body = result
    },

    async getPlayerList(ctx){

        let result = {
            success: false,
            message: '',
            data: null,
        }

        let playerList = await teamInfoService.getPlayerList()
        if(playerList){
            result.data = playerList
            result.success = true
            let count = result.data !== null ? result.data.length : 0
            ctx.set("x-total-count", count);
        }else{
            result.code = 'FAIL_NO_PLAYER'
            result.message = teamCode.FAIL_NO_PLAYER
        }
        
        ctx.body = result
    },

    async getPlayerInfo(ctx){
        let result = {
            success: false,
            message: '',
            data: null,
          }
      
        const {id} = ctx.query;
      
        if(id !== null){
            let playerInfo = await teamInfoService.getPlayerInfoById(id)
            if(playerInfo){
              result.data = playerInfo
              result.success = true
            }else{
              result.code = 'FAIL_PLAYER_NO_EXIST'
              result.message = teamCode.FAIL_PLAYER_NO_EXIST
            }
        }else{
              result.code = 'FAIL_PLAYER_NO_EXIST'
              result.message = teamCode.FAIL_PLAYER_NO_EXIST
        }
      
          ctx.body = result
    },

    async createPlayer(ctx){
        let formData = ctx.request.body
        let result = {
            success: false,
            message: '',
            data: null
        }
        var logger = log4js.getLogger('common')

        let existOne = await teamInfoService.getPlayerExistOne(formData)

        if(existOne){
            if(existOne.meId == formData.me_id && existOne.teamId == formData.team_id){
                result.message = teamCode.FAIL_PLAYER_IS_EXIST
                ctx.body = result
                logger.error("createPlayer existOne team_id:",result)
                return
            }
        }

        let playerResult = await teamInfoService.createPlayer({
            teamId: formData.team_id,
            meId: fromData.me_id,
            team_title: (formData.team_title != undefined) ? formData.team_title : 3,
            status: (formData.status !== undefined) ? formData.status : 3,
            game_count: 0,
            avg_points: 0,
            total_points: 0,
            avg_rebound: 0,
            total_rebound: 0,
            avg_assist: 0,
            total_assist: 0,
            avg_block: 0,
            total_block: 0,
            avg_steal: 0,
            total_steal: 0,
            avg_three_point_hit: 0,
            total_three_point_hit: 0,
            scoring_leader: 0,
            rebound_leader: 0,
            assisting_leader: 0,
            blocking_leader: 0,
            stealing_leader: 0,         
        })

        if(playerResult && playerResult.success){
            result.success = true
            result.data = {};
            result.data.id = playerResult.id
        }else{
            result.code = 'ERROR_SYS'
            result.message = teamCode.ERROR_SYS
        }

        logger.error("createPlayer:",result)
        ctx.body = result
    },

    async updatePlayerInfo(ctx){
        let formData = ctx.request.body
        let result = {
            success: false,
            message: '',
            data: null
        }

        let player = {}
        if(formData.team_title !== undefined)
            player.team_title = formData.team_title
        if(formData.status !== undefined)
            player.status = formData.status

        if(formData.new_points !== undefined)
            player.new_points = formData.new_points

        if(formData.new_rebound !== undefined)
            player.new_rebound = formData.new_rebound

        if(formData.new_assist !== undefined)
            player.new_assist = formData.new_assist

        if(formData.new_block !== undefined)
            player.new_block = formData.new_block

        if(formData.new_steal !== undefined)
            player.new_steal = formData.new_steal

        if(formData.new_three_point_hit !== undefined)
            player.new_three_point_hit = formData.new_three_point_hit
        
        if(formData.increase_scoring_leader !== undefined)
            player.increase_scoring_leader = formData.increase_scoring_leader

        if(formData.increase_scoring_leader !== undefined)
            player.increase_rebound_leader = formData.increase_rebound_leader

        if(formData.increase_assisting_leader !== undefined)
            player.increase_assisting_leader = formData.increase_assisting_leader

        if(formData.increase_blocking_leader !== undefined)
            player.increase_blocking_leader = formData.increase_blocking_leader

        if(formData.increase_stealing_leader !== undefined)
            player.increase_stealing_leader = formData.increase_stealing_leader

        if(formData.id !== undefined)
        {
            player.id = formData.id
        }

        if(formData.me_id !== undefined)
        {
            player.meId = formData.me_id
        }

        if(formData.team_id !== undefined)
        {
            player.teamId = formData.team_id
        }

        let playerResult = await teamInfoService.updatePlayerInfo(player)
        if(playerResult && playerResult.success){
            result.success = true
        }else{
            result.code = 'ERROR_SYS'
            result.message = teamCode.ERROR_SYS
        }

        ctx.body = result
    },

}
