const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    guildId: { type: String, required: true, unique: true },

    // Fixed roles
    reqrole: { type: String, default: null },
    official: { type: String, default: null },
    friend: { type: String, default: null },
    guest: { type: String, default: null },
    girl: { type: String, default: null },
    vip: { type: String, default: null },

    // Dynamic roles
    names: { type: [String], default: [] }, // custom role names
    roles: { type: [String], default: [] }, // custom role IDs
  },
  { timestamps: true }
);

module.exports = mongoose.model("Roles", roleSchema);