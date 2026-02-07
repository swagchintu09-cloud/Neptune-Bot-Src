const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "unlock",
  description: "Unlock a text channel.",
  category: "Moderation",
  usage: "[#channel]",

  run: async (client, message, args) => {
    // ---------- SAFETY CHECKS ----------
    if (!message.guild || !message.member || !message.channel) return;

    // ---------- PERMISSION CHECK ----------
    if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225") // maroon
            .setDescription("<:Crossmark:1447578705198055484> | You don’t have permission to unlock channels!"),
        ],
      });
    }

    // ---------- TARGET CHANNEL ----------
    const channel = message.mentions.channels.first() || message.channel;

    // Check bot permissions
    if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageChannels)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225") // maroon
            .setDescription("<:Crossmark:1447578705198055484> | I don’t have permission to manage this channel!"),
        ],
      });
    }

    try {
      const everyoneRole = message.guild.roles.everyone;

      // Reset SendMessages permission for @everyone
      await channel.permissionOverwrites.edit(everyoneRole, {
        SendMessages: null,
      });

      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225") // maroon
            .setDescription(`<:TICK:1447578703335919778> | ${channel} has been unlocked!`),
        ],
      });
    } catch (err) {
      console.error(err);
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225") // maroon
            .setDescription("<:Crossmark:1447578705198055484> | Failed to unlock the channel. Make sure my role is above @everyone and I have Manage Channels permission."),
        ],
      });
    }
  },
};