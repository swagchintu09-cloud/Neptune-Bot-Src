const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "mute",
  aliases: ["stfu"],
  description: "Mute a user in the server for a specific duration.",
  category: "Moderation",
  usage: "<@user> <time> [reason]",

  run: async (client, message, args) => {
    // Check user permission
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription("<:Crossmark:1447578705198055484> | You don’t have permission to use this command!"),
        ],
      });
    }

    // Check bot permission
    if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("202225")
            .setDescription("<:Crossmark:1447578705198055484> | I don’t have **Moderate Members** permission!"),
        ],
      });
    }

    // Target user
    const target = message.mentions.members.first();
    if (!target) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("202225")
            .setDescription("<:Crossmark:1447578705198055484> | Please mention a user to mute!"),
        ],
      });
    }

    // Duration
    const time = args[1];
    if (!time) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("202225")
            .setDescription("<:Crossmark:1447578705198055484> | Please provide a duration! Example: `10m`, `1h`, `1d`"),
        ],
      });
    }

    const duration = ms(time);
    if (!duration || duration < 1000 || duration > 2419200000) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription("<:Crossmark:1447578705198055484> | Invalid duration! Must be between **1s and 28d**."),
        ],
      });
    }

    // Reason
    const reason = args.slice(2).join(" ") || "No reason provided";

    // Apply timeout (mute)
    try {
      await target.timeout(duration, reason);
    } catch (err) {
      return message.reply({
        embeds: [
          new EmbedBuilder().setColor("#202225").setDescription("<:Crossmark:1447578705198055484> | Failed to mute this user."),
        ],
      });
    }

    // Success
    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("#202225")
          .setDescription(
            `<:TICK:1447578703335919778> | ${target.user.tag} has been muted for **${ms(duration, { long: true })}**.\n**Reason:** ${reason}`
          ),
      ],
    });
  },
};