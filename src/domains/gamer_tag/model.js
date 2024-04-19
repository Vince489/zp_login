const mongoose = require('mongoose');

const gamerTagSchema = new mongoose.Schema({
  gamerTag: {
    type: String,
    required: true,
    unique: true,
  },
  fighters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fighter',
  }],
  dateRegistered: {
    type: Date,
    default: Date.now,
  },
});

const GamerTag = mongoose.model('GamerTag', gamerTagSchema);
module.exports = GamerTag;