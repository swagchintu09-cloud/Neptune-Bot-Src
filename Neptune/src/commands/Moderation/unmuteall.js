const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "unmuteall",
  description: "Unmute all members in the server (removes timeout).",
  category: "Moderation",

  run: async (client, message) => {
    try {
      if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#202225")
              .setDescription("<:Crossmark:1447578705198055484> | You don’t have permission to unmute members!"),
          ],
        });
      }

      let count = 0;
      for (const member of message.guild.members.cache.values()) {
        if (member.isCommunicationDisabled()) {
          await member.timeout(null).catch(() => null);
          count++;
        }
      }

      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription(`<:TICK:1447578703335919778> | Successfully unmuted **${count}** members.`),
        ],
      });
    } catch (err) {
      console.error(err);
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription("<:Crossmark:1447578705198055484> | Failed to unmute all members."),
        ],
      });
    }
  },
};