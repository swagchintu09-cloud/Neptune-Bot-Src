const { Message, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "skip",
  aliases: ["s"],
  description: `Skips the song currently playing.`,
  // userPermissions: PermissionFlagsBits.SendMessages,
  // botPermissions: PermissionFlagsBits.SendMessages,
  category: "Music",
  //cooldown: 10,
  inVc: true,
  sameVc: true,
  dj: true,
  run: async (client, message, args, prefix, player) => {
    if (!player) {
      const embed = new EmbedBuilder()
        .setDescription("<:Crossmark:1447578705198055484> | No Player Found For This Guild!")
        .setColor(client.config.color);
      return message.channel.send({ embeds: [embed] });
    }

    if (player.paused) {
      const embed = new EmbedBuilder()
        .setColor(client.config.color)
        .setDescription(`<:Crossmark:1447578705198055484> | **Cannot Skip Song While Paused**`);
      return message.channel.send({ embeds: [embed] });
    }
    if (!args[0]) {
      await player.skip();
      return message.react("<:TICK:1447578703335919778>>");
    }

    if (isNaN(args[0]))
      return message.channel.send("<:Crossmark:1447578705198055484> | Please provide a valid number!");
    if (args[0] > player.queue.length)
      return message.channel.send("<:Crossmark:1447578705198055484> | The queue is not that long!");
    player.queue.remove(0, parseInt(args[0]));
    player.skip();
    return message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.color)
          .setDescription(`<:TICK:1447578703335919778>> | Skipped ${args[0]} song.`),
      ],
    });
  },
};
