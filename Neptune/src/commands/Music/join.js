const { PermissionsBitField } = require("discord.js");

module.exports = {
  name: "join",
  aliases: ["j"],
  description: "Make the bot join your voice channel.",
  category: "Music",
  cooldown: 5,
  inVc: true,
  sameVc: true,
  premium: false,
  dj: false,

  run: async (client, message, args, prefix) => {
    const channel = message.member.voice.channel;
    if (!channel) return message.react("<:Crossmark:1447578705198055484>").catch(() => {});

    const botPerms = channel.permissionsFor(message.guild.members.me);

    if (
      !botPerms.has(PermissionsBitField.Flags.ViewChannel) ||
      !botPerms.has(PermissionsBitField.Flags.Connect) ||
      !botPerms.has(PermissionsBitField.Flags.Speak)
    ) {
      return message.react("<:Crossmark:1447578705198055484>").catch(() => {});
    }

    // ✅ React first
    await message.react("<:TICK:1447578703335919778>").catch(() => {});

    // ✅ Create / Get player
    let player = client.manager.players.get(message.guild.id);
    if (!player) {
      player = await client.manager.createPlayer({
        guildId: message.guild.id,
        voiceId: channel.id,
        textId: message.channel.id,
        deaf: true,
      });
    }
  },
};