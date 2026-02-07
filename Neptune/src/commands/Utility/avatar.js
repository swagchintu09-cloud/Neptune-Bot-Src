const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  name: "avatar",
  aliases: ["av"],
  category: "Utility",
  description: "Shows your or another user's avatar.",
  usage: "+avatar [@user | userID]",
  run: async (client, message, args) => {
    try {
      let user;

      // Agar mention ya id di ho
      if (args[0]) {
        user = await client.users.fetch(args[0].replace(/[<@!>]/g, "")).catch(() => null);
        if (!user) return message.reply("<:Crossmark:1447578705198055484> Invalid user mention or ID.");
      } else {
        // Agar kuch na likhe to khud ka
        user = message.author;
      }

      // Full user fetch for avatar
      const fetchedUser = await client.users.fetch(user.id, { force: true });

      if (!fetchedUser.displayAvatarURL()) {
        return message.reply("<:Crossmark:1447578705198055484> This user does not have an avatar.");
      }

      const avatarURL = fetchedUser.displayAvatarURL({ size: 1024 });

      const embed = new EmbedBuilder()
        .setAuthor({
          name: `${fetchedUser.username}'s Avatar`,
          iconURL: fetchedUser.displayAvatarURL({ dynamic: true })
        })
        .setColor("#202225")
        .setImage(avatarURL)
        .setFooter({
          text: `Requested by ${message.author.tag}`,
          iconURL: message.author.displayAvatarURL({ dynamic: true })
        })
        .setTimestamp();

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("PNG")
          .setStyle(ButtonStyle.Link)
          .setURL(fetchedUser.displayAvatarURL({ extension: "png", size: 1024 })),
        new ButtonBuilder()
          .setLabel("JPG")
          .setStyle(ButtonStyle.Link)
          .setURL(fetchedUser.displayAvatarURL({ extension: "jpg", size: 1024 })),
        new ButtonBuilder()
          .setLabel("WEBP")
          .setStyle(ButtonStyle.Link)
          .setURL(fetchedUser.displayAvatarURL({ extension: "webp", size: 1024 }))
      );

      message.channel.send({ embeds: [embed], components: [row] });
    } catch (err) {
      console.error(err);
      message.reply("<:Crossmark:1447578705198055484> Error while fetching avatar.");
    }
  }
};