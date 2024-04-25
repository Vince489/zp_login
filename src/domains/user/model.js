const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  gamerTags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GamerTag',
  }],
  email: { 
    type: String, 
    required: true,
    unique: true 
  },
  image: {
    type: String,
    default: 'https://raw.githubusercontent.com/Vince489/BNV_Image/main/boxing-gloves.png',
  },
  codeName: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
  verified: { 
    type: Boolean, 
    default: false 
  },
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gamer',
  }],
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  }],
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    default: null,
  },
  badges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Badge',
  }],
  socialMedia: {
    facebook: {
      type: String,
    },
    instagram: {
      type: String,
    },
    twitch: {
      type: String,
    },
    youtube: {
      type: String,
    },
  },
  roles: {
    type: [String], // Store roles as an array of strings
    enum: ['user', 'gamer', 'fighter', 'trainer', 'manager', 'promoter', 'trainer', 'admin'], 
    default: ['user']
  },
  isAuthenticated: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;