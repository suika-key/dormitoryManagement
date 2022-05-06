const mongoose = require('mongoose');
const baseModel = require('./base-model');

const dormSchema = new mongoose.Schema({
  ...baseModel,
  dorId: {
    type: String,
    required: true,
    unique: true
  },
  dorNum: {
    type: Number,
    max: 8,
    required: true
  },
  dorFact: {
    type: Number,
    default: 0
  },
  flId: {
    type: String,
    required: true
  }
});

module.exports = dormSchema;