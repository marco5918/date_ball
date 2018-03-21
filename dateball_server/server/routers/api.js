const Router = require('koa-router')
const userInfoController = require('./../controllers/user-info')
const teamInfoController = require('./../controllers/team-info')

const router = new Router()
const routers = router
  .all('/*',userInfoController.verifyToken)
  .get('/user/getUserList.json',userInfoController.getUserList)
  .get('/user/getUserInfo.json',userInfoController.getLoginUserInfo)
  .post('/user/signIn.json',userInfoController.signIn)
  .post('/user/signUp.json',userInfoController.signUp)
  .patch('/user/updateUserInfo.json',userInfoController.updateUserInfo)
  .post('/user/uploadHeadshot.json',userInfoController.uploadHeadshot)
  .get('/team/getTeamList.json',teamInfoController.getTeamList)
  .get('team/getTeamInfo.json',teamInfoController.getTeamInfo)
  .post('/team/createTeam.json',teamInfoController.createTeam)
  .patch('/team/updateTeamInfo.json',teamInfoController.updateTeamInfo)
  .post('/team/uploadTeamLogo.json',teamInfoController.uploadTeamLogo)
  .get('/player/getPlayerList.json',teamInfoController.getPlayerList)
  .get('/player/getPlayerInfo.json',teamInfoController.getPlayerInfo)
  .post('/player/createPlayer.json',teamInfoController.createPlayer)
  .patch('/player/updatePlayerInfo.json',teamInfoController.updatePlayerInfo)


module.exports = routers
