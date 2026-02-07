const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "stickersteal",
  aliases: ["ssteal","ss"],
  description: "Steal a sticker from a replied message and add it to your server.",
  category: "Moderation",
  usage: "Reply to a message with +stickersteal",

  run: async (client, message) => {
    const MAROON = "#202225";

    if (!message.member.permissions.has(PermissionFlagsBits.ManageEmojisAndStickers)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(MAROON)
            .setDescription("<:Crossmark:1447578705198055484> | You don’t have permission to add stickers!"),
        ],
      });
    }

    if (!message.reference) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(MAROON)
            .setDescription("<:Crossmark:1447578705198055484> | You must reply to a message containing a sticker!"),
        ],
      });
    }

    try {
      const repliedMessage = await message.channel.messages.fetch(message.reference.messageId);

      if (!repliedMessage.stickers || repliedMessage.stickers.size === 0) {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(MAROON)
              .setDescription("<:Crossmark:1447578705198055484> | The replied message has no stickers!"),
          ],
        });
      }

      // Sticker limit: Discord allows max 1 at a time per API call
      const sticker = repliedMessage.stickers.first();

      const added = await message.guild.stickers.create({
        name: sticker.name,
        file: sticker.url,
      });

      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(MAROON)
            .setDescription(`<:TICK:1447578703335919778> | Sticker **${added.name}** has been added!`),
        ],
      });
    } catch (err) {
      console.error("Failed to steal sticker:", err);
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(MAROON)
            .setDescription("<:Crossmark:1447578705198055484> | Failed to steal the sticker. Make sure I have Manage Emojis & Stickers permission and that the sticker is supported."),
        ],
      });
    }
  },
};