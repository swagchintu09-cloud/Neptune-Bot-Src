const { EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  name: "wouldyourather",
  description: "Get a random 'Would You Rather' question",
  run: async (client, message, args) => {
    try {
      const res = await fetch("https://api.truthordarebot.xyz/api/wyr");
      const data = await res.json();

      const embed = new EmbedBuilder()
        .setTitle("Would You Rather...")
        .setDescription(data.question)
        .setColor("#202225")
        .setFooter({ text: "Type your choice in chat!" });

      message.channel.send({ embeds: [embed] });
    } catch (e) {
      console.error(e);
      message.channel.send("<:Crossmark:1447578705198055484> Couldn't fetch a WYR question, try again later!");
    }
  }
};