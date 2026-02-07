const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "vcundeafenall",
  category: "Voice",
  description: "Undeafen all users in your current VC",

  run: async (client, message, args) => {
    if (!message.member.permissions.has(PermissionFlagsBits.DeafenMembers)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription("<:Crossmark:1447578705198055484> | You lack **Deafen Members** permission."),
        ],
      });
    }

    const vc = message.member.voice.channel;
    if (!vc) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription("<:warn:1447578710155985041> | You must be in a voice channel."),
        ],
      });
    }

    try {
      for (const [memberId, member] of vc.members) {
        if (member.voice && member.voice.serverDeaf) {
          await member.voice.setDeaf(false, `Undeafened by ${message.author.tag}`);
        }
      }

      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription(`<:TICK:1447578703335919778> | All users in ${vc} have been undeafened.`),
        ],
      });
    } catch {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription("<:Crossmark:1447578705198055484> | Failed to undeafen all users."),
        ],
      });
    }
  },
};
