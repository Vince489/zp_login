const mongoose = require('mongoose');
const crypto = require('crypto');

const blockSchema = new mongoose.Schema({
  timeStamp: {
    type: Date,
    default: () => new Date().toISOString(), // Store timestamp in ISO format
    required: true,
  },
  blockHeight: {
    type: Number,
    index: true,
    required: true,
    default: 1,
  },
  hash: {
    type: String,
    unique: true,
    required: true,
  },
  previousHash: {
    type: String,
    required: true,
  },
  transactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
  }],
  signature: {
    type: String,
    required: true,
  },
  validator: {
    type: String,
    required: true,
  },
  validatorSignature: {
    type: String,
    required: true,
  },
});

blockSchema.pre('save', function (next) {
  // Create a hash only if it's a new block
  if (!this.isNew) {
    return next();
  }

  const dataToHash = this.timeStamp + JSON.stringify(this.transactions) + this.previousHash;
  const hash = crypto.createHash('sha256').update(dataToHash).digest('hex');
  this.hash = hash;

  next();
});

const Block = mongoose.model('Block', blockSchema);

module.exports = Block;
