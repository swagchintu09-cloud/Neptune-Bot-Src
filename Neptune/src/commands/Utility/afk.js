const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "afk",
  description: "Set yourself as AFK with optional mood emoji",
  usage: "+afk <reason> | <emoji>",
  run: async (client, message, args) => {
    if (!client.afk) client.afk = new Map();

    let input = args.join(" ");
    let reason = input.split("|")[0]?.trim() || "AFK";
    let mood = input.split("|")[1]?.trim() || "";

    // Save AFK details
    client.afk.set(message.author.id, {
      reason: reason,
      mood: mood,
      time: Date.now(),
    });

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${message.author.username}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      })
      .setDescription(
        `<:Afk:1447645181615538236> | **You are now marked as AFK** ${mood}\n**Reason:** ${reason}`
      )
      .setColor("#202225")
      .setFooter({
        text: `AFK since`,
        iconURL: message.guild.iconURL({ dynamic: true }),
      })
      .setTimestamp(Date.now()); // exact AFK time

    message.reply({ embeds: [embed] });
  },
};