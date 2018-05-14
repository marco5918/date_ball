const model = require('./../server/utils/model.js');

let MeModel = model.me,
    HobbyBasketballInfoModel = model.hobby_basketball_info,
    TeamModel = model.team,
    PlayerModel = model.player

MeModel.hasOne(HobbyBasketballInfoModel, { onDelete: 'cascade', hooks: true })
HobbyBasketballInfoModel.belongsTo(MeModel, { onDelete: 'cascade', hooks: true })

MeModel.hasMany(PlayerModel, { onDelete: 'cascade', hooks: true })
PlayerModel.belongsTo(MeModel, { onDelete: 'cascade', hooks: true })

TeamModel.hasMany(PlayerModel, { onDelete: 'cascade', hooks: true })
PlayerModel.belongsTo(TeamModel, { onDelete: 'cascade', hooks: true })

TeamModel.sync()
PlayerModel.sync()
MeModel.sync()
HobbyBasketballInfoModel.sync()

console.log('init db ok.');
//process.exit(0);