const mongoose = require("mongoose");

const GiveawaySchema = new mongoose.Schema({
  messageId: String,
  channelId: String,
  guildId: String,
  prize: String,
  winnersCount: Number,
  endAt: Number,
  ended: { type: Boolean, default: false },
  hostId: String
});

module.exports = mongoose.model("Giveaway", GiveawaySchema);