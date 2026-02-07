const { Message, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "resume",
  aliases: ["resume"],
  description: `resume the music`,
  // userPermissions: PermissionFlagsBits.SendMessages,
  // botPermissions: PermissionFlagsBits.SendMessages,
  category: "Music",
  cooldown: 5,
  inVc: true,
  sameVc: true,
  dj: true,
  premium: false,
  run: async (client, message, args, prefix, player) => {
    if (!player) {
      const embed = new EmbedBuilder()
        .setDescription("<:Crossmark:1447578705198055484> | No Player Found For This Guild!")
        .setColor(client.config.color);
      return message.channel.send({ embeds: [embed] });
    }
    await player.pause(player.playing);
    const uni = player.paused ? `Paused` : `Resumed`;

    const embed = new EmbedBuilder()
        .setDescription(`<:TICK:1447578703335919778>> | *Song has been:* \`${uni}\``)
        .setColor(client.color);

    return message.reply({ embeds: [embed] });

  },
};
