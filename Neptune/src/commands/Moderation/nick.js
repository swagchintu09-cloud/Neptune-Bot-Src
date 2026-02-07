const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "nick",
  aliases: ["nickname"],
  description: "Change or reset a user's nickname.",
  category: "Moderation",
  usage: "<@user> [new nickname]",

  run: async (client, message, args) => {
    const MAROON = "#202225"; // Maroon color HEX

    // User permission check
    if (!message.member.permissions.has(PermissionFlagsBits.ManageNicknames)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(MAROON)
            .setDescription("<:Crossmark:1447578705198055484> | You don’t have permission to use this command!"),
        ],
      });
    }

    // Bot permission check
    if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageNicknames)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(MAROON)
            .setDescription("<:Crossmark:1447578705198055484> | I don’t have **Manage Nicknames** permission!"),
        ],
      });
    }

    const target = message.mentions.members.first();
    if (!target) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(MAROON)
            .setDescription("<:Crossmark:1447578705198055484> | Please mention a user to change their nickname!"),
        ],
      });
    }

    const newNick = args.slice(1).join(" ");

    try {
      if (!newNick) {
        // reset nickname
        await target.setNickname(null, `Nickname reset by ${message.author.tag}`);
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(MAROON)
              .setDescription(`<:TICK:1447578703335919778> | Successfully reset **${target.user.tag}**'s nickname to their original username!`),
          ],
        });
      } else {
        // set new nickname
        await target.setNickname(newNick, `Nickname changed by ${message.author.tag}`);
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(MAROON)
              .setDescription(`<:TICK:1447578703335919778> | Successfully changed **${target.user.tag}**'s nickname to **${newNick}**!`),
          ],
        });
      }
    } catch (err) {
      console.error(err);
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(MAROON)
            .setDescription("<:Crossmark:1447578705198055484> | Failed to change nickname."),
        ],
      });
    }
  },
};