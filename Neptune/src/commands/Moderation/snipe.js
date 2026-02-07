// commands/Moderation/snipe.js
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "snipe",
  description: "View the last deleted message in this channel.",
  category: "Moderation",
  run: async (client, message) => {
    const snipe = client.snipes.get(message.channel.id);

    if (!snipe) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225") // maroon
            .setDescription("<:Crossmark:1447578705198055484> | No deleted messages found."),
        ],
      });
    }

    const embed = new EmbedBuilder()
      .setTitle("Sniped Message")
      .setColor("#202225")
      .addFields(
        { name: "Content", value: snipe.content || "*No content*" },
        { name: "Author", value: snipe.author.tag },
        {
          name: "Timestamp",
          value: `<t:${Math.floor(snipe.time.getTime() / 1000)}:F>`,
        }
      )
      .setFooter({ text: `Sniped by ${message.author.tag}` });

    message.reply({ embeds: [embed] });
  },
};