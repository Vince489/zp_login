const mongoose = require('mongoose');

const vrtAccountSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  coin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VRT',
    required: true,
  },
  publicKey: {
    type: String,
    required: true,
    unique: true,
  },
  balance: {
    type: Number,
    default: 0
  },
  isFrozen: {
    type: Boolean,
    default: false
  },
  airdropReceived: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  transactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
  }],
});


const VRTAccount = mongoose.model('VRTAccount', vrtAccountSchema);

module.exports = VRTAccount;

