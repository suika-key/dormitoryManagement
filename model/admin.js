const mongoose = require('mongoose');
const baseModel = require('./base-model');

const adminSchema = new mongoose.Schema({
  ...baseModel,
  admId: {
    type: String,
    required: true,
    unique: true
  },
  admName: {
    type: String,
    required: true
  },
  admSex: {
    type: String,
    enum: [0, 1],
    required: true
  },
  admTel: {
    type: String,
    required: true
  }
});

module.exports = adminSchema;