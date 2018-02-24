const fs = require('fs')
const path = require('path')
const getSqlContentMap = require('./util/get-sql-content-map')
const {query} = require('./util/db')

const eventLog = function(err, shell, index){
  if(err){
    console.log(`[ERROR] sql脚本：${shell} 第${index+1}条脚本执行失败`)
  }else{
    console.log(`[SUCCESS] sql脚本：${shell} 第${index+1}条脚本执行成功`)
  }
}

let sqlContentMap = getSqlContentMap()

const createAllTables = async ()=>{
  for(let key in sqlContentMap){
    let sqlShell = sqlContentMap[key]
    let sqlShellList = sqlShell.split(';')

    for(let [i, shell] of sqlShellList.entries()){
      if(shell.trim()){
        let result = await query(shell)
        if(result.serverStatus * 1 === 2){
          eventLog(null, shell, i)
        }else{
          eventLog(true, shell, i)
        }
      }
    }
  }
  console.log('sql 脚本执行结束！')
}

createAllTables()
