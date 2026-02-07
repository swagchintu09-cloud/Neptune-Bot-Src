const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "unbanall",
  description: "Unban all banned users in the server.",
  category: "Moderation",

  run: async (client, message) => {
    try {
      if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#202225")
              .setDescription("<:Crossmark:1447578705198055484> | You don’t have permission to unban members!"),
          ],
        });
      }

      const bans = await message.guild.bans.fetch();
      let count = 0;

      for (const ban of bans.values()) {
        await message.guild.members.unban(ban.user.id, `UnbanAll used by ${message.author.tag}`).catch(() => null);
        count++;
      }

      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription(`<:TICK:1447578703335919778> | Successfully unbanned **${count}** users.`),
        ],
      });
    } catch (err) {
      console.error(err);
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription("<:Crossmark:1447578705198055484> | Failed to unban all users."),
        ],
      });
    }
  },
};