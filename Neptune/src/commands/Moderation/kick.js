const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "kick",
  description: "Kick a user from the server.",
  category: "Moderation",
  usage: "<@user> [reason]",

  run: async (client, message, args) => {
    // Check user permission
    if (!message.member.permissions.has(PermissionFlagsBits.KickMembers)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription("<:Crossmark:1447578705198055484> | You don’t have permission to use this command!"),
        ],
      });
    }

    // Check bot permission
    if (!message.guild.members.me.permissions.has(PermissionFlagsBits.KickMembers)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription("<:Crossmark:1447578705198055484> | I don’t have **Kick Members** permission!"),
        ],
      });
    }

    // Get target
    const target = message.mentions.members.first();
    if (!target) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription("<:Crossmark:1447578705198055484> | Please mention a user to kick!"),
        ],
      });
    }

    // Check kickable
    if (!target.kickable) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription("<:Crossmark:1447578705198055484> | I cannot kick this user."),
        ],
      });
    }

    const reason = args.slice(1).join(" ") || "No reason provided";

    // Kick user
    await target.kick(reason);

    // Success
    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("#202225")
          .setDescription(`<:TICK:1447578703335919778> | ${target.user.tag} has been kicked!\n**Reason:** ${reason}`),
      ],
    });
  },
};