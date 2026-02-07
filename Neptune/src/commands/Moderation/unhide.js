const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "unhide",
  description: "Unhide a text channel.",
  category: "Moderation",
  usage: "[#channel]",

  run: async (client, message, args) => {
    try {
      // ---------- SAFETY CHECKS ----------
      if (!message.guild || !message.member || !message.channel) return;

      // ---------- USER PERMISSION ----------
      if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#202225") // maroon
              .setDescription("<:Crossmark:1447578705198055484> | You don’t have permission to unhide channels!"),
          ],
        });
      }

      // ---------- TARGET CHANNEL ----------
      const channel = message.mentions.channels.first() || message.channel;

      // ---------- BOT PERMISSION ----------
      if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageChannels)) {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#202225") // maroon
              .setDescription("<:Crossmark:1447578705198055484> | I don’t have permission to manage this channel!"),
          ],
        });
      }

      // ---------- UNHIDE CHANNEL ----------
      await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
        ViewChannel: true,
      });

      // ---------- CONFIRMATION ----------
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225") // maroon
            .setDescription(`<:TICK:1447578703335919778> | ${channel} has been unhidden!`),
        ],
      });

    } catch (err) {
      console.error(err);
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225") // maroon
            .setDescription("<:Crossmark:1447578705198055484> | There was an error while executing the command."),
        ],
      });
    }
  },
};