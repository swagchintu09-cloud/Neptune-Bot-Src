const { EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  name: "truth",
  description: "Get a random Truth question",
  run: async (client, message, args) => {
    try {
      const res = await fetch("https://api.truthordarebot.xyz/api/truth");
      const data = await res.json();

      const embed = new EmbedBuilder()
        .setTitle("Truth")
        .setDescription(data.question)
        .setColor("#202225")
        .setFooter({ text: "Be honest" });

      message.channel.send({ embeds: [embed] });
    } catch (e) {
      console.error(e);
      message.channel.send("<:Crossmark:1447578705198055484> Couldn't fetch a truth question, try again later!");
    }
  }
};