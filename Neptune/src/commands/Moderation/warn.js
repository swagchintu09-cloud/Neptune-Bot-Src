// commands/Moderation/warn.js
const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "warn",
  description: "Warn a member.",
  category: "Moderation",
  usage: "<@user> [reason]",

  run: async (client, message, args) => {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription("<:Crossmark:1447578705198055484> | You don’t have permission to warn members!"),
        ],
      });
    }

    const target = message.mentions.members.first();
    if (!target) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription("<:Crossmark:1447578705198055484> | Please mention a valid user to warn."),
        ],
      });
    }

    const reason = args.slice(1).join(" ") || "No reason provided";

    // warnings storage
    if (!client.warnings) client.warnings = new Map();
    const userWarnings = client.warnings.get(target.id) || [];
    userWarnings.push({
      moderator: message.author.tag,
      reason,
      date: new Date(),
    });
    client.warnings.set(target.id, userWarnings);

    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("#202225")
          .setTitle("Member Warned")
          .addFields(
            { name: "User", value: `${target.user.tag}`, inline: true },
            { name: "Moderator", value: `${message.author.tag}`, inline: true },
            { name: "Reason", value: reason }
          )
          .setFooter({ text: `Total Warnings: ${userWarnings.length}` }),
      ],
    });
  },
};