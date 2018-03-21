const model = require('./../server/utils/model.js');

let MeModel = model.me,
    HobbyBasketballInfoModel = model.hobby_basketball_info,
    TeamModel = model.team,
    PlayerModel = model.player

MeModel.hasOne(HobbyBasketballInfoModel)
HobbyBasketballInfoModel.belongsTo(MeModel)

MeModel.hasOne(PlayerModel)
PlayerModel.belongsTo(MeModel)

TeamModel.hasMany(PlayerModel)
PlayerModel.belongsTo(TeamModel)

TeamModel.sync()
PlayerModel.sync()
MeModel.sync()
HobbyBasketballInfoModel.sync()

console.log('init db ok.');
//process.exit(0);
