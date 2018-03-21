const db = require('./../utils/db')
const Sequelize = require('sequelize')

module.exports = db.defineModel('player',{
    team_title: db.SMALLINT(2),
    status: db.SMALLINT(2),
    game_count: db.INTEGER(11),
    avg_points: db.DOUBLE,
    total_points: db.INTEGER(11),
    avg_rebound: db.DOUBLE,
    total_rebound: db.INTEGER(11),
    avg_assist: db.DOUBLE,
    total_assist: db.INTEGER(11),
    avg_block: db.DOUBLE,
    total_block: db.INTEGER(11),
    avg_steal: db.DOUBLE,
    total_steal: db.INTEGER(11),
    avg_three_point_hit: db.DOUBLE,
    total_three_point_hit: db.INTEGER(11),
    scoring_leader: db.INTEGER(11),
    rebound_leader: db.INTEGER(11),
    assisting_leader: db.INTEGER(11),
    blocking_leader: db.INTEGER(11),
    stealing_leader: db.INTEGER(11),
})
