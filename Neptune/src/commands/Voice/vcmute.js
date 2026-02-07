const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "vcmute",
  aliases: ["vcm"],
  category: "Voice",
  description: "Server mute a user in VC",

  run: async (client, message, args) => {
    const target = message.mentions.members.first();

    if (!target) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription("<:warn:1447578710155985041> | Please mention a user."),
        ],
      });
    }

    if (!message.member.permissions.has(PermissionFlagsBits.MuteMembers)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription("<:Crossmark:1447578705198055484> | You lack **Mute Members** permission."),
        ],
      });
    }

    try {
      await target.voice.setMute(true, `Muted by ${message.author.tag}`);
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription(`<:TICK:1447578703335919778> | ${target} has been muted.`),
        ],
      });
    } catch {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription("<:Crossmark:1447578705198055484> | Failed to mute user."),
        ],
      });
    }
  },
};