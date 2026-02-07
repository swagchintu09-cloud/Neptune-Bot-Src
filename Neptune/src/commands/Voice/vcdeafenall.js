const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "vcdeafenall",
  category: "Voice",
  description: "Deafen all users in your current VC",

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
        if (member.voice && !member.voice.serverDeaf) {
          await member.voice.setDeaf(true, `Deafened by ${message.author.tag}`);
        }
      }

      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("202225")
            .setDescription(`<:TICK:1447578703335919778> | All users in ${vc} have been deafened.`),
        ],
      });
    } catch (err) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription("<:Crossmark:1447578705198055484> | Failed to deafen all users."),
        ],
      });
    }
  },
};
