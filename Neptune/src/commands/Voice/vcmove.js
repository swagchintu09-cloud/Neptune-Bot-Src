const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "vcmove",
  aliases: ["move"],
  category: "voice",
  description: "Move a mentioned user into your current VC",

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

    const target = message.mentions.members.first();
    if (!target) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription("<:Crossmark:1447578705198055484> | Please mention a user to move.")
        ]
      });
    }

    if (target.id === invoker.id) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription("<:Crossmark:1447578705198055484> | You cannot move yourself with this command.")
        ]
      });
    }

    const me = message.guild.members.me;
    if (!me.permissions.has(PermissionFlagsBits.MoveMembers)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription("<:Crossmark:1447578705198055484> | I need the **Move Members** permission to do that.")
        ]
      });
    }

    if (!target.voice?.channel) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription("<:Crossmark:1447578705198055484> | That user is not in a voice channel.")
        ]
      });
    }

    try {
      await target.voice.setChannel(
        invoker.voice.channel,
        `Moved by ${message.author.tag} using vcmove`
      );
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription(`<:TICK:1447578703335919778> | Successfully moved ${target} to your voice channel!`)
        ]
      });
    } catch (err) {
      console.error(err);
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription(`<:warn:1447578710155985041> | Failed to move ${target}.`)
        ]
      });
    }
  },
};
