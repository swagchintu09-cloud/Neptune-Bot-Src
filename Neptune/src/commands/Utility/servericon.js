const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  name: "servericon",
  aliases: ["sicon"],
  category: "Utility",
  description: "Shows the server's icon.",
  run: async (client, message) => {
    try {
      const { guild } = message;

      if (!guild.iconURL()) {
        return message.reply("<:Crossmark:1447578705198055484> This server does not have an icon.");
      }

      const iconURL = guild.iconURL({ size: 1024 });

      const embed = new EmbedBuilder()
        .setAuthor({
          name: `${guild.name}'s Icon`,
          iconURL: iconURL
        })
        .setColor("#202225")
        .setImage(iconURL)
        .setFooter({
          text: `Requested by ${message.author.tag}`,
          iconURL: message.author.displayAvatarURL({ dynamic: true })
        })
        .setTimestamp();

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("PNG")
          .setStyle(ButtonStyle.Link)
          .setURL(guild.iconURL({ extension: "png", size: 1024 })),
        new ButtonBuilder()
          .setLabel("JPG")
          .setStyle(ButtonStyle.Link)
          .setURL(guild.iconURL({ extension: "jpg", size: 1024 })),
        new ButtonBuilder()
          .setLabel("WEBP")
          .setStyle(ButtonStyle.Link)
          .setURL(guild.iconURL({ extension: "webp", size: 1024 }))
      );

      message.channel.send({ embeds: [embed], components: [row] });
    } catch (err) {
      console.error(err);
      message.reply("<:Crossmark:1447578705198055484> Error while fetching server icon.");
    }
  }
};