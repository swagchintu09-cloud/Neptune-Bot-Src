const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "unmute",
  description: "Unmute a user in the server.",
  category: "Moderation",
  usage: "<@user> [reason]",

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
            .setColor("#202225")
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
            .setColor("#202225")
            .setDescription("<:Crossmark:1447578705198055484> | Please mention a user to unmute!"),
        ],
      });
    }

    // Reason
    const reason = args.slice(1).join(" ") || "No reason provided";

    try {
      await target.timeout(null, reason); // Remove timeout
    } catch (err) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription("<:Crossmark:1447578705198055484> | Failed to unmute this user."),
        ],
      });
    }

    // Success
    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("#202225")
          .setDescription(`<:TICK:1447578703335919778> | Successfully unmuted **${target.user.tag}**!\n**Reason:** ${reason}`),
      ],
    });
  },
};