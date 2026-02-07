const { EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  name: "dare",
  description: "Get a random Dare challenge",
  run: async (client, message, args) => {
    try {
      const res = await fetch("https://api.truthordarebot.xyz/api/dare");
      const data = await res.json();

      const embed = new EmbedBuilder()
        .setTitle("Dare")
        .setDescription(data.question)
        .setColor("#202225")
        .setFooter({ text: "Do it if you dare" });

      message.channel.send({ embeds: [embed] });
    } catch (e) {
      console.error(e);
      message.channel.send("<:Crossmark:1447578705198055484> Couldn't fetch a dare, try again later!");
    }
  }
};