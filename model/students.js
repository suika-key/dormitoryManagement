const mongoose = require('mongoose');
const baseModel = require('./base-model');

const stuSchema = new mongoose.Schema({
  ...baseModel,
  stuKey: {
    type: String,
    unique: true,
    required: true
  },
  stuName: {
    type: String,
    required: true
  },
  stuSex: {
    type: String,
    //0为女 1为男
    enum: [0, 1],
    required: true
  },
  college: {
    type: String,
    required: true
  },
  major: {
    type: String,
    required: true
  },
  dorId: {
    type: String,
    required: true
  }
});

module.exports = stuSchema;