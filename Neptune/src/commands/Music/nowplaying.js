const { Message, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const formatDuration = require("../../structure/formatDuration.js");

module.exports = {
  name: "nowplaying",
  aliases: ["np"],
  description: `Display the song currently playing.`,
  // userPermissions: PermissionFlagsBits.SendMessages,
  // botPermissions: PermissionFlagsBits.SendMessages,
  category: "Music",
  cooldown: 5,
  inVc: true,
  dj: true,
  sameVc: true,
  premium: false,
  run: async (client, message, args, prefix, player) => {
    if (!player) {
      const embed = new EmbedBuilder()
        .setDescription("<:Crossmark:1421145262176338021> | No Player Found For This Guild!")
        .setColor(client.config.color);
      return message.channel.send({ embeds: [embed] });
    }

    const song = player.queue.current;
    const CurrentDuration = formatDuration(player.position);
    const TotalDuration = formatDuration(song.length);

    const Part = Math.floor((player.position / song.length) * 30);
    const Emoji = player.playing ? "<:N_duration:1447642542479769765>" : "<:pause:1447642625481113613>";

    const embed = new EmbedBuilder()
      .setAuthor({
        name: player.playing ? `Now Playing` : `Song Paused`,
        iconURL: client.user.displayAvatarURL(),
      })
      .setColor(client.color)
      .setDescription(
        `**<:Playing:1447642543918682122> [${
          song.title.length > 50
            ? song.title.slice(0, 50) + "..."
            : song.title || "Unknow Track"
        }](${client.config.ssLink})**`
      )
      /*.addFields({
        name: `Author:`,
        value: `${song.author || "Unknow"}`,
        inline: true,
      })*/
      .addFields({
        name: `<:requester:1447642535966150676> Requester:`,
        value: `${song.requester || "**Neptune**"}`,
        inline: true,
      })
      .addFields({
        name: `<:Volume_up:1447642537379495948> Volume:`,
        value: `${player.options.volume}%`,
        inline: true,
      })
      .addFields({
        name: `<:NeXPlaylist:1447642539485167646> Queue Length:`,
        value: `${player.queue.length}`,
        inline: true,
      })
      .addFields({
        name: `<:N_duration:1447642542479769765> Duration: \`[${CurrentDuration} / ${TotalDuration}]\``,
        value: `${Emoji} **Progress:**\n\`\`\`${
          "─".repeat(Part) + "🔘" + "─".repeat(30 - Part)
        }\`\`\``,
        inline: false,
      })
      .setTimestamp();

    if (song.thumbnail) {
      embed.setThumbnail(song.thumbnail);
    } else {
      embed.setThumbnail(client.user.displayAvatarURL());
    }

    return message.reply({ embeds: [embed] });
  },
};
