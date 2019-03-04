const db = require('./../utils/db')
const Sequelize = require('sequelize')

module.exports = db.defineModel('pk', {
    select_self_team: {
        type: db.INTEGER(20),
    },
    select_pk_team: {
        type: db.INTEGER(20),
        allowNull: true
    },
    pk_type: {
        type: db.SMALLINT(2)
    },
    reply: db.SMALLINT(2),
    start_datetime: db.DATE,
    last_answer_datetime: db.DATE,
    contact_name: db.STRING(255),
    contact_phone: db.STRING(255),
    comment: {
        type: db.STRING(3000),
        allowNull: true
    }
})