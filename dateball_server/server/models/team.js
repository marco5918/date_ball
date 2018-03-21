const db = require('./../utils/db')
const Sequelize = require('sequelize')

module.exports = db.defineModel('team',{
  team_name:{
    type: db.STRING(255),
    unique: true
  },
  team_logo:{
    type: db.STRING(255),
    allowNull: true
  },
  team_city: db.STRING(255),
  team_info: db.STRING(255),
  match_num: db.INTEGER(11),
  train_num: db.INTEGER(11),
  winning_rate: db.SMALLINT(3),
})
