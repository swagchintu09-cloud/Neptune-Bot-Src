const { EmbedBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");

module.exports = {
  name: "lockall",
  description: "Lock all text channels in the server.",
  category: "Moderation",

  run: async (client, message) => {
    try {
      if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#202225")
              .setDescription("<:Crossmark:1447578705198055484> | You don’t have permission to lock channels!"),
          ],
        });
      }

      let count = 0;
      for (const channel of message.guild.channels.cache.values()) {
        if (channel.type === ChannelType.GuildText) {
          await channel.permissionOverwrites
            .edit(message.guild.roles.everyone, { SendMessages: false })
            .catch(() => null);
          count++;
        }
      }

      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription(`<:TICK:1447578703335919778> | Successfully locked **${count}** channels.`),
        ],
      });
    } catch (err) {
      console.error(err);
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription("<:Crossmark:1447578705198055484> | Failed to lock all channels."),
        ],
      });
    }
  },
};