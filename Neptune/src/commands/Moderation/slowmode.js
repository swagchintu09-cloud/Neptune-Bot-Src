const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "slowmode",
  description: "Set slowmode in a text channel.",
  category: "Moderation",
  usage: "<time>",

  run: async (client, message, args) => {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription("<:Crossmark:1447578705198055484> | You don’t have permission to use this command!"),
        ],
      });
    }

    const time = args[0];
    if (!time) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription("<:Crossmark:1447578705198055484> | Please provide a duration! Example: `5s`, `10m`, `1h`"),
        ],
      });
    }

    // Convert time to seconds
    const duration = ms(time) / 1000;
    if (isNaN(duration) || duration < 0 || duration > 21600) { // max 6 hours
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription("<:Crossmark:1447578705198055484> | Invalid duration! Must be between **0s and 6h**."),
        ],
      });
    }

    try {
      await message.channel.setRateLimitPerUser(duration, `Slowmode set by ${message.author.tag}`);
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription(`<:TICK:1447578703335919778> | Slowmode set to **${time}** for this channel!`),
        ],
      });
    } catch (err) {
      console.error(err);
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription("<:Crossmark:1447578705198055484> | Failed to set slowmode."),
        ],
      });
    }
  },
};