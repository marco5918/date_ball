const jwt = require('jwt-simple');
const allConfig = require('./../../config')
const jwtConfig = allConfig.jwt
const moment = require('moment')


let jwt_encode = function(payload){
    const token = jwt.encode(payload, jwtConfig.secret, jwtConfig.encode);
    return token;
}

let jwt_decode = function(token){
    const res = jwt.decode(token, jwtConfig.secret, false, jwtConfig.encode);
    return res;
}

let jwt_build = function(id, login_user, expires){
    
    let payload = {
        user_id: id,
        login_user: login_user,
        exp : expires,
      }

    const token = jwt_encode(payload)
    return token
}

module.exports = {
    jwt_build,
    jwt_encode,
    jwt_decode,
}

