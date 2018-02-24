const Sequelize = require('sequelize')
const uuid = require('node-uuid')
const allConfig = require('./../../config')
const config = allConfig.database

function generateId(){
  return uuid.v4()
}

var sequelize = new Sequelize(config.DATABASE, config.USERNAME, config.PASSWORD,{
  host: config.HOST,
  port: config.PORT,
  dialect: 'mysql',
  underscored: true,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
})

const ID_TYPE = Sequelize.BIGINT(20)

function defineModel(name, attributes){
  var attrs = {}
  for(let key in attributes){
    let value = attributes[key]
    if(typeof value === 'object' && value['type']){
      value.allowNull = value.allowNull || false
      attrs[key] = value
    }else{
      attrs[key] = {
        type: value,
        allowNull: false
      }
    }
  }

  attrs.id = {
    type: ID_TYPE,
    autoIncrement: true,
    primaryKey: true
  }

  // attrs.createdAt = {
  //   type: Sequelize.BIGINT,
  //   allowNull: false
  // }
  //
  // attrs.updatedAt = {
  //   type: Sequelize.BIGINT,
  //   allowNull: false
  // }
  //
  // attrs.version = {
  //   type: Sequelize.BIGINT,
  //   allowNull: false
  // }

  // console.log('model defined for table: '+name+'\n'+JSON.stringify(attrs, function(k,v){
  //   if(k === 'type'){
  //     for(let key in Sequelize){
  //       if(key === 'ABSTRACT' || key === 'NUMBER'){
  //         continue
  //       }
  //
  //       let dbType = Sequelize[key]
  //       //console.log("dbType="+dbType)
  //       //console.log("v="+v)
  //       if(typeof(dbType) === 'function'){
  //
  //         // if( v instanceof dbType ){
  //         //   if(v._length){
  //         //     return `${dbType.key}(${v._length})`
  //         //   }
  //         //   return dbType.key
  //         // }
  //
  //         if(v === dbType){
  //           return v.key
  //         }else{
  //           if(v._length){
  //             return `${v.key}(${v._length})`
  //           }
  //           return v.key
  //         }
  //       }
  //     }
  //   }
  //   return v
  // },' '))

  return sequelize.define(name, attrs, {
    tableName: name,
    timestamps: true,
    version: true,
    hooks:{
      beforeValidate: function(obj){
        let now = Date.now()
        if(obj.isNewRecord){
          //console.log('will create entity...',obj)
          // if(!obj.id){
          //   obj.id = generateId()
          // }
          // obj.createdAt = now
          // obj.updatedAt = now
          // obj.version = 0
        }else{
          //console.log('will update entity...',obj)
          // obj.updatedAt = Date.now()
          // obj.version++
        }
      }
    }
  })
}

const TYPES = ['STRING', 'INTEGER', 'SMALLINT','BIGINT', 'TEXT', 'DOUBLE', 'NOW', 'DATE', 'DATEONLY', 'BOOLEAN']

var exp = {
  defineModel: defineModel,
  sync:() => {
    //only allow create ddl in non-production environment:
    console.log("process.env.NODE_ENV:"+process.env.NODE_ENV)
    if(process.env.NODE_ENV !== 'production'){
        sequelize.sync({force: true, logging: console.log}).then(function(){
        console.log("sync success")
      }).catch(function(err){
        console.log("sync err:"+err.message)
      })

    }else{
      throw new Error('Cannot sync() when NODE_ENV is set to \'production\'.')
    }
  }
}

for(let type of TYPES){
  exp[type] = Sequelize[type]
  //console.log(`exp[${type}] = ${exp[type]}`)
}

module.exports = exp
