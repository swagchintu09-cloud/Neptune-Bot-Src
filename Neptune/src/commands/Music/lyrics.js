const { EmbedBuilder } = require("discord.js");
const { Google } = require("@flytri/lyrics-finder");

module.exports = {
  name: "lyrics",
  description: `Display lyrics of the current playing song or given song.`,
  category: "Music",
  cooldown: 5,
  inVc: true,
  sameVc: true,
  voteOnly: false,
  dj: false,
  premium: false,

  run: async (client, message, args, prefix, player) => {
    const channel = message.member.voice.channel;

    // ❌ Agar user VC me nahi hai
    if (!channel) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription("<:Crossmark:1447578705198055484> | You must be in a voice channel to use this command!"),
        ],
      });
    }

    // ❌ Agar bot VC me nahi hai
    if (!message.guild.members.me.voice.channel) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription("<:Crossmark:1447578705198055484> | I'm not connected to any voice channel!"),
        ],
      });
    }

    // ✅ Song title check
    let song;
    if (args[0]) {
      // user ne manually song name diya
      song = args.join(" ");
    } else {
      // user ne song name nahi diya, to current playing song lo
      if (!player || !player.queue.current) {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setDescription("<:Crossmark:1447578705198055484> | No song is currently playing!"),
          ],
        });
      }
      song = player.queue.current.title;
    }

    try {
      const result = await Google(song, "en");

      if (!result || !result.lyrics) {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setDescription(`<:Crossmark:1447578705198055484> | No lyrics found for **${song}**`),
          ],
        });
      }

      const lyricsText =
        result.lyrics.length <= 4096
          ? result.lyrics
          : result.lyrics.slice(0, 4080) + "\n..........";

      const lyricsEmbed = new EmbedBuilder()
        .setColor(client.color)
        .setTitle(`🎵 Lyrics for: ${song}`)
        .setDescription(lyricsText)
        .setFooter({ text: "Powered by Google Lyrics Finder" })
        .setTimestamp();

      return message.reply({ embeds: [lyricsEmbed] });
    } catch (err) {
      console.error("Lyrics error:", err);
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(`<:Crossmark:1447578705198055484> | Couldn't fetch lyrics for **${song}**`),
        ],
      });
    }
  },
};