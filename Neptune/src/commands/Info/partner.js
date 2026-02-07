const { Message, PermissionFlagsBits, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
  name: "partner",
  aliases: ["sponser"],
  description: "Get Bot Sponsers !!",
  // userPermissions: PermissionFlagsBits.SendMessages,
  // botPermissions: PermissionFlagsBits.SendMessages,
  category: "Info",
  cooldown: 5,

  run: async (client, message, args, prefix) => {
    const embed = new EmbedBuilder()
      .setColor(client.color)
      .setTitle(`Neptune - Sponser`)
      .setDescription(`**Currently, We Don't Have Paid Sponsers Now, If you want to Sponser Neptune Then, Join Support Server**`);

    const button = new ButtonBuilder()
      .setLabel(`Support Server`)
      .setStyle(ButtonStyle.Link)
      .setEmoji("<:support:1447626636290953328>")
      .setURL(`https://discord.gg/RbyBv2GsTn`);

    const row = new ActionRowBuilder().addComponents(button);

    return message.reply({
      embeds: [embed],
      components: [row]
    });
  },
};
