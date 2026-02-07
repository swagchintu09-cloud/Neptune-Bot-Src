const mongoose = require("mongoose");

const VoiceSchema = new mongoose.Schema({
  guildId: String,
  userId: String,
  allTime: { type: Number, default: 0 },
  daily: { type: Number, default: 0 },
  weekly: { type: Number, default: 0 },
});

module.exports = mongoose.model("voice", VoiceSchema);