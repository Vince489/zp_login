const mongoose = require('mongoose');

const nodeSchema = new mongoose.Schema({
  identity: {
    type: String,
    required: true,
    unique: true,
  },
  details: {
    ipAddress: String,
    port: Number,
  },
  blockchain: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Block',
  }],
  status: {
    indicator: String,
    uptime: Number, // Represented in milliseconds
  },
  peers: {
    count: Number,
    list: [String], // Array of peer identities or IP addresses
  },
  blockchainStats: {
    blockHeight: Number,
    transactionCount: Number,
  },
  nodeHealth: {
    latency: Number,
    memoryUsage: Number,
    cpuUsage: Number,
  },
  consensus: {
    algorithm: String,
    validatorStatus: String,
  },
  metadata: {
    alias: String,
    location: String,
  },
  network: {
    connectionType: String,
    firewallStatus: String,
  },
}, { timestamps: true });

const Node = mongoose.model('Node', nodeSchema);
module.exports = Node;
