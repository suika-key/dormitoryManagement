const mongoose = require("mongoose");
const { dbUrl } = require('../config');

mongoose.connect(dbUrl);

const db = mongoose.connection;

//当连接失败的时候
db.on('error', err=>{
  console.log('MongoDB 数据库连接失败', err);
});

//当连接成功的时候
db.on('open', err=>{
  console.log('MongoDB 数据库连接成功');
});

//导出模型类
module.exports = {
  User: mongoose.model('User', require('./user')),
  Floor: mongoose.model('Floor', require('./floor')),
  Admin: mongoose.model('Admin', require('./admin')),
  Student: mongoose.model('Student', require('./students')),
  Dorm: mongoose.model('Dorm', require('./dorm'))
}