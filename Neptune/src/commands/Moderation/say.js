const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "say",
  description: "Make the bot say something.",
  category: "Moderation",
  usage: "<message>",

  run: async (client, message, args) => {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription("❌ | You don’t have permission to use this command!"),
        ],
      });
    }

    const text = args.join(" ");
    if (!text) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription("❌ | Please provide a message for me to say!"),
        ],
      });
    }

    try {
      await message.delete();
      message.channel.send({ content: text });
    } catch (err) {
      console.error(err);
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription("❌ | Failed to send message."),
        ],
      });
    }
  },
};