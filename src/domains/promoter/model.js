const mongoose = require('mongoose');

const promoterSchema = new mongoose.Schema({
  gamerTag: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GamerTag',
    required: true,
  },
  // Promoter details
  name: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
  },
  image: {
    type: String,
  },
  // Fighters managed by the promoter
  promotedFighters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fighter',
  }],
  // Contact information
  contact: {
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
  },
  // Badges associated with the promoter
  badges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Badge',
  }],
});

const Promoter = mongoose.model('Promoter', promoterSchema);

module.exports = Promoter;
