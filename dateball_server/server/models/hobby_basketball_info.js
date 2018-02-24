const db = require('./../utils/db')
const Sequelize = require('sequelize')
const me = require('./me')

module.exports = db.defineModel('hobby_basketball_info',{
  height: db.INTEGER(11),
  weight: db.INTEGER(11),
  jersey_number: db.INTEGER(11),
  position: db.STRING(10),
  nba_team: db.STRING(255),
  love_star: db.STRING(255),
  strong_point: db.STRING(255),
  // me_id: {
  //   type: db.BIGINT(20),
  //   references:{
  //     model: me,
  //     key: 'id',
  //     deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
  //   }
  // },
})
