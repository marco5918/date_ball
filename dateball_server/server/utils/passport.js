var bcrypt = require('bcrypt');
var config = require('../../config');
var Promise = require('bluebird');
Promise.promisifyAll(bcrypt);
/**
 * 加盐加密
 * @params password {string} 原始密码
 * @return hash {object} 加密密码
 * @author marco
 */
var encrypt = async function(password) {
    var salt = await bcrypt.genSaltAsync(config.password.saltTimes);
    var hash = await bcrypt.hashAsync(password, salt);
    return hash;
};
/**
 * 密码对比
 * @params password {string} 原始密码
 * @params hash {string} 加密密码
 * @return res {boolean} 比对结果 true:密码匹配 | false:密码不匹配
 * @author marco
 */
var validate = async function(password, hash) {
    var res = await bcrypt.compareAsync(password, hash);
    return res
};
module.exports = {
    encrypt,
    validate
}
