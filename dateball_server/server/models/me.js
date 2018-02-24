const db = require('./../utils/db')
const Sequelize = require('sequelize')

module.exports = db.defineModel('me',{
  phone:{
    type: db.STRING(20),
    unique: true
  },
  login_user:{
    type: db.STRING(255),
    unique: true
  },
  favicon:{
    type: db.STRING(255),
    allowNull: true
  },
  password: db.STRING(255),
  name: db.STRING(255),
  nick_name: db.STRING(255),
  city: db.STRING(255),
  age: db.INTEGER(11),
  gender: db.SMALLINT(2),
  job: db.STRING(255),
  hobby: db.STRING(255),
  last_login_time: db.DATE,
  create_time: db.DATE,
  modified_time: db.DATE
})
