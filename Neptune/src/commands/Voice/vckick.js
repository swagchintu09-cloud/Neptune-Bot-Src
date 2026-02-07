const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "vckick",
  aliases: ["vck"],
  category: "Voice",
  description: "Disconnect a user from VC",

  run: async (client, message, args) => {
    const target = message.mentions.members.first();

    if (!target) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription("<:warn:1447578710155985041> | Please mention a user."),
        ],
      });
    }

    if (!message.member.permissions.has(PermissionFlagsBits.MoveMembers)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription("<:Crossmark:1447578705198055484> | You lack **Move Members** permission."),
        ],
      });
    }

    try {
      await target.voice.disconnect(`Kicked by ${message.author.tag}`);
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription(`<:TICK:1447578703335919778> | ${target} has been disconnected.`),
        ],
      });
    } catch {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription("<:Crossmark:1447578705198055484> | Failed to disconnect user."),
        ],
      });
    }
  },
};