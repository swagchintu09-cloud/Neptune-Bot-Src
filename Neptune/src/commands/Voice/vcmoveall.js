const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "vcmoveall",
  aliases: ["moveall"],
  category: "voice",
  description: "Move all members from your voice channel to another voice channel",
  usage: "<channel_id | #channel_mention>",

  run: async (client, message, args) => {
    const invoker = message.member;

    // Check if invoker is in a VC
    if (!invoker.voice?.channel) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription("<:Crossmark:1447578705198055484> | You need to be in a voice channel to use this command.")
        ]
      });
    }

    // Target VC ID or mention
    const targetChannelId = args[0]?.replace(/[<#>]/g, "");
    if (!targetChannelId) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription("<:Crossmark:1447578705198055484> | Please provide the voice channel ID or mention where members should be moved.")
        ]
      });
    }

    const targetChannel = message.guild.channels.cache.get(targetChannelId);
    if (!targetChannel || targetChannel.type !== 2) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription("<:Crossmark:1447578705198055484> | Invalid target voice channel.")
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

    const members = invoker.voice.channel.members.filter(m => !m.user.bot && m.id !== me.id);

    if (members.size === 0) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription("<:Crossmark:1447578705198055484> | No members to move from your voice channel.")
        ]
      });
    }

    try {
      for (const member of members.values()) {
        await member.voice.setChannel(targetChannel, `Moved by ${message.author.tag} using vcmoveall`);
      }

      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription(`<:TICK:1447578703335919778> | Successfully moved **${members.size} member(s)** from your voice channel to <#${targetChannelId}>!`)
        ]
      });
    } catch (err) {
      console.error(err);
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription("<:Crossmark:1447578705198055484> | Failed to move some members.")
        ]
      });
    }
  },
};
