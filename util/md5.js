const crypto = require('crypto');

module.exports = str => {
  return crypto.createHash('md5')
    .update('suika_key' + str) //添加了一个私钥
    .digest('hex');
}