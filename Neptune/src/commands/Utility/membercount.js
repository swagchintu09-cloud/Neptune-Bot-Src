const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "membercount",
  aliases: ["mc"],
  category: "Utility",
  description: "Shows server member count",
  run: async (client, message) => {
    const guild = message.guild;

    const embed = new EmbedBuilder()
      .setTitle(`${guild.name} Members`)
      .setDescription(`<:requester:1447645650949902417> **Total Members:** ${guild.memberCount}`)
      .setColor("#202225");

    message.channel.send({ embeds: [embed] });
  },
};