module.exports = {
  name: "disconnect",
  aliases: ["dc", "leave"],
  description: "Make the bot leave your voice channel.",
  category: "Music",
  cooldown: 5,
  inVc: true,
  sameVc: true,
  vote: false,
  dj: false,

  run: async (client, message, args, prefix) => {
    const channel = message.member.voice.channel;
    if (!channel) return message.react("<:Crossmark:1447578705198055484>").catch(() => {});

    // get existing player
    let player = client.manager.players.get(message.guild.id);
    if (!player) return message.react("<:Crossmark:1447578705198055484>").catch(() => {});

    // destroy player (disconnect)
    player.destroy();

    // ✅ React success
    return message.react("<:TICK:1447578703335919778>").catch(() => {});
  },
};