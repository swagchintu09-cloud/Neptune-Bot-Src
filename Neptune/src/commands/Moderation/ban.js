const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "ban",
  aliases: ["fuckyou","maachuda"],
  description: "Ban a user from the server.",
  category: "Moderation",
  usage: "<@user> [reason]",

  run: async (client, message, args) => {
    // Check user permission
    if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription("<:Crossmark:1447578705198055484> | You don’t have permission to use this command!"),
        ],
      });
    }

    // Check bot permission
    if (!message.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription("<:Crossmark:1447578705198055484> | I don’t have **Ban Members** permission!"),
        ],
      });
    }

    // Get target
    const target = message.mentions.members.first();
    if (!target) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription("<:Crossmark:1447578705198055484> | Please mention a user to ban!"),
        ],
      });
    }

    // Check bannable
    if (!target.bannable) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription("<:Crossmark:1447578705198055484> | I cannot ban this user."),
        ],
      });
    }

    const reason = args.slice(1).join(" ") || "No reason provided";

    // Ban user
    await target.ban({ reason });

    // Success
    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Green")
          .setDescription(`<:TICK:1447578703335919778> | ${target.user.tag} has been banned!\n**Reason:** ${reason}`),
      ],
    });
  },
};