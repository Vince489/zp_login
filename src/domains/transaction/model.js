// transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  sender: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
    },
    publicKey: {
      type: String,
      required: true,
    },
    beginningBalance: {
      type: Number,
    },
    endingBalance: {
      type: Number,
    },
  },
  recipient: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
    },
    publicKey: {
      type: String,
      required: true,
    },
    beginningBalance: {
      type: Number,
    },
    endingBalance: {
      type: Number,
    },
  },
  type: {
    type: String,
    enum: ['transfer', 'stake', 'airdrop', 'create_account', 'create_token', 'mint_token', 'burn_token'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  signature: {
    type: String,
    required: true,
  },    
  timestamp: {
    type: Date,
    default: new Date().toISOString(),
  },
  confirmations: {
    type: Number,
    default: 0,
  },
  complete: {
    type: Boolean,
    default: false,
  },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
