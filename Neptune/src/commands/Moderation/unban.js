const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "unban",
  description: "Unban a user from the server.",
  category: "Moderation",
  usage: "<userID> [reason]",

  run: async (client, message, args) => {
    if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription("<:Crossmark:1447578705198055484> | You don’t have permission to use this command!"),
        ],
      });
    }

    const userId = args[0];
    if (!userId) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription("<:Crossmark:1447578705198055484> | Please provide the user ID to unban!"),
        ],
      });
    }

    const reason = args.slice(1).join(" ") || "No reason provided";

    try {
      await message.guild.bans.remove(userId, reason);
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription(`<:TICK:1447578703335919778> | Successfully unbanned user with ID **${userId}**!\n**Reason:** ${reason}`),
        ],
      });
    } catch (err) {
      console.error(err);
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription("<:Crossmark:1447578705198055484> | Failed to unban this user. Make sure the ID is correct."),
        ],
      });
    }
  },
};