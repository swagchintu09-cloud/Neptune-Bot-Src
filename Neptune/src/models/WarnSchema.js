const { Schema, model } = require("mongoose");

let warnSchema = new Schema({
  guildId: String,
  userId: String,
  moderator: String,
  reason: String,
  date: Date,
});

module.exports = model("Warn", warnSchema);
