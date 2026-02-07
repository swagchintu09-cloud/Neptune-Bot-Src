// commands/Moderation/clearwarn.js
const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "clearwarn",
  description: "Clear all warnings of a member.",
  category: "Moderation",
  usage: "<@user>",

  run: async (client, message, args) => {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription("<:Crossmark:1447578705198055484> | You don’t have permission to clear warnings!"),
        ],
      });
    }

    const target = message.mentions.members.first();
    if (!target) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription("<:Crossmark:1447578705198055484> | Please mention a valid user to clear warnings."),
        ],
      });
    }

    if (!client.warnings || !client.warnings.has(target.id)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription("<:info:1447587778845212824> | This user has no warnings."),
        ],
      });
    }

    client.warnings.delete(target.id);

    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("#202225")
          .setDescription(`<:TICK:1447578703335919778> | Cleared all warnings for **${target.user.tag}**.`),
      ],
    });
  },
};