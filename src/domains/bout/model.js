const mongoose = require('mongoose');

const boutSchema = new mongoose.Schema({
  opponent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fighter',
  },
  result: {
    type: String,
    required: true
  },
  method: {
    type: String,
    required: true
  },
  round: {
    type: Number,
    required: true
  },
  knockdowns: {
    type: Number
  },
  opponentOVR: {
    type: Number
  },
  fighterOVR: {
    type: Number
  },
  oppWgt: {
    type: Number
  },
  fighterWgt: {
    type: Number
  },
  date: {
    type: Date,
  },
  venue: {
    type: String
  },
  purse: {
    type: Number
  },
  scoreCards: {
    type: String
  },
  punchStats: {
    type: String
  }
});

const Bout = mongoose.model('Bout', boutSchema);

module.exports = Bout;
