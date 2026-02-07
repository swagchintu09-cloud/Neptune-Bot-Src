const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "vclist",
  category: "Voice",
  description: "List all members in your VC",

  run: async (client, message, args) => {
    if (!message.member.voice?.channel)
      return message.reply("<:warn:1447578710155985041> | You need to be in a VC to use this.");

    const members = message.member.voice.channel.members.map(m => m.user.tag);
    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("#202225")
          .setTitle(`🎧 Members in ${message.member.voice.channel.name}`)
          .setDescription(members.join("\n") || "No members found."),
      ],
    });
  },
};
