// src/models/MessageSchema.js
const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  userId: { type: String, required: true },
  // counters used in your messageCreate.js
  allTime: { type: Number, default: 0 },
  daily: { type: Number, default: 0 },
  weekly: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", MessageSchema);