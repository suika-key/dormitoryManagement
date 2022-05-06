const mongoose = require('mongoose');

const floorSchema = new mongoose.Schema({
  flId: {
    type: String,
    required: true,
    unique: true
  },
  surplusRoom: {
    type: Number,
    required: true
  }
});

module.exports = floorSchema;