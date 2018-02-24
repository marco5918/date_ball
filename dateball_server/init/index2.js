const model = require('./../server/utils/model.js');

let MeModel = model.me,
    HobbyBasketballInfoModel = model.hobby_basketball_info

MeModel.hasOne(HobbyBasketballInfoModel)
HobbyBasketballInfoModel.belongsTo(MeModel)

MeModel.sync()
HobbyBasketballInfoModel.sync()

console.log('init db ok.');
//process.exit(0);
