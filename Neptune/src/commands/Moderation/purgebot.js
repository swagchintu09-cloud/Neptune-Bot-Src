const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "purgebot",
  aliases: ["pb"],
  description: "Delete the last 10 messages from bots in this channel.",
  category: "Moderation",
  usage: "+pb",
  cooldown: 3,
  userPerms: [PermissionFlagsBits.ManageMessages],

  run: async (client, message, args) => {
    const MAROON = "#202225";

    // Check user permission
    if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(MAROON)
            .setDescription("<:Crossmark:1447578705198055484> | You need Manage Messages permission to use this command!"),
        ],
      });
    }

    try {
      // Fetch last 50 messages to make sure we catch bot messages
      const fetched = await message.channel.messages.fetch({ limit: 50 });
      const botMessages = fetched.filter(msg => msg.author.bot).first(10);

      if (!botMessages.length) {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(MAROON)
              .setDescription("<:Crossmark:1447578705198055484> | No bot messages found in the last 50 messages."),
          ],
        });
      }

      // Delete the command message itself
      await message.delete().catch(() => {});

      // Bulk delete bot messages
      await message.channel.bulkDelete(botMessages, true);

      const confirm = await message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(MAROON)
            .setDescription(`<:TICK:1447578703335919778> | Successfully deleted **${botMessages.length}** bot messages.`),
        ],
      });

      setTimeout(() => confirm.delete().catch(() => {}), 3000);
    } catch (err) {
      console.error(err);
      message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(MAROON)
            .setDescription("<:Crossmark:1447578705198055484> | An error occurred while trying to delete bot messages."),
        ],
      });
    }
  },
};