const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "vcmuteall",
  category: "voice",
  description: "Mute all users in your voice channel",

  run: async (client, message, args) => {
    const invoker = message.member;
    if (!invoker.voice?.channel) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription("<:Crossmark:1447578705198055484> | You need to be in a voice channel to use this command.")
        ]
      });
    }

    const me = message.guild.members.me;
    if (!me.permissions.has(PermissionFlagsBits.MuteMembers)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription("<:Crossmark:1447578705198055484> | I need the **Mute Members** permission to do that.")
        ]
      });
    }

    const members = invoker.voice.channel.members.filter(m => !m.user.bot && m.id !== invoker.id);

    if (members.size === 0) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription("<:Crossmark:1447578705198055484> | No other members to mute in your voice channel.")
        ]
      });
    }

    members.forEach(member => member.voice.setMute(true, "Muted by vcmuteall"));

    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("#202225")
          .setDescription(`<:TICK:1447578703335919778> | Muted ${members.size} member(s) in your voice channel!`)
      ]
    });
  },
};
