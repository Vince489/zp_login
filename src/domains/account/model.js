const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  seedPhrase: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SeedPhrase',
    required: true,
    unique: true
  },
  publicKey: {
    type: String,
    required: true,
    unique: true
  },
  privateKey: {
    type: String,
    required: true,
    unique: true
  },
  vrtAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'vrtAccount',
  },
  tokenAccounts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TokenAccount',
  }],
  transactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
  }],
  stake: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Stake',
  }],  
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
