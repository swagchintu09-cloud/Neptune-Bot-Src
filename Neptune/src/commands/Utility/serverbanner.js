const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  name: "serverbanner",
  aliases: ["sbanner", "sb"],
  category: "Utility",
  description: "Shows the server's banner.",
  run: async (client, message) => {
    try {
      const { guild } = message;

      if (!guild.bannerURL()) {
        return message.reply("<:Crossmark:1447578705198055484> This server does not have a banner.");
      }

      const bannerURL = guild.bannerURL({ size: 1024 });

      const embed = new EmbedBuilder()
        .setAuthor({
          name: `${guild.name}'s Banner`,
          iconURL: guild.iconURL({ dynamic: true })
        })
        .setColor("#202225")
        .setImage(bannerURL)
        .setFooter({
          text: `Requested by ${message.author.tag}`,
          iconURL: message.author.displayAvatarURL({ dynamic: true })
        })
        .setTimestamp();

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("PNG")
          .setStyle(ButtonStyle.Link)
          .setURL(guild.bannerURL({ extension: "png", size: 1024 })),
        new ButtonBuilder()
          .setLabel("JPG")
          .setStyle(ButtonStyle.Link)
          .setURL(guild.bannerURL({ extension: "jpg", size: 1024 })),
        new ButtonBuilder()
          .setLabel("WEBP")
          .setStyle(ButtonStyle.Link)
          .setURL(guild.bannerURL({ extension: "webp", size: 1024 }))
      );

      message.channel.send({ embeds: [embed], components: [row] });
    } catch (err) {
      console.error(err);
      message.reply("<:Crossmark:1447578705198055484> Error while fetching server banner.");
    }
  }
};