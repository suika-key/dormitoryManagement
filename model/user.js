const mongoose = require('mongoose');
const baseModel = require('./base-model');

const userSchema = new mongoose.Schema({
  ...baseModel,
  userId: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  userStatus: {
    type: String,
    //0表示学生 1表示宿舍管理员 2表示系统管理员
    enum: [0, 1, 2],
    required: true
  }
});

module.exports = userSchema;