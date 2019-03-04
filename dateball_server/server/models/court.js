const db = require('./../utils/db')
const Sequelize = require('sequelize')

module.exports = db.defineModel('court', {
    court_img: {
        type: db.STRING(255),
        allowNull: true
    },

    court_name: db.STRING(255),
    court_addr: db.STRING(255),
    court_price: {
        type: db.STRING(255),
        allowNull: true
    },
    num: {
        type: db.SMALLINT(4),
        allowNull: true
    },
    open_time: {
        type: db.STRING(255),
        allowNull: true
    },
    contact: {
        type: db.STRING(255),
        allowNull: true
    },
    remark: {
        type: db.STRING(1024),
        allowNull: true
    },
    position: {
        type: db.STRING(1024),
        allowNull: true
    }
})