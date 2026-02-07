const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "steal",
  description: "Steal an emoji from another server and add it here.",
  category: "Moderation",
  usage: "<emoji> [name]",

  run: async (client, message, args) => {
    const MAROON = "#202225"; // Maroon color HEX

    if (!message.member.permissions.has(PermissionFlagsBits.ManageEmojisAndStickers)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(MAROON)
            .setDescription("<:Crossmark:1447578705198055484> | You don’t have permission to add emojis!"),
        ],
      });
    }

    let emojiInput = args[0];
    let name = args[1];

    // 🔹 If command is used as reply, check replied message for emoji
    if (!emojiInput && message.reference) {
      try {
        const repliedMessage = await message.channel.messages.fetch(message.reference.messageId);
        const emojiMatch = /<(a)?:([a-zA-Z0-9_]+):(\d+)>/.exec(repliedMessage.content);
        if (emojiMatch) {
          emojiInput = emojiMatch[0]; // full emoji string
          if (!name) name = emojiMatch[2]; // use original emoji name
        }
      } catch (err) {
        console.error(err);
      }
    }

    if (!emojiInput) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(MAROON)
            .setDescription("<:Crossmark:1447578705198055484> | Please provide or reply to a custom emoji!"),
        ],
      });
    }

    // Regex to detect custom emoji
    const customEmoji = /<(a)?:([a-zA-Z0-9_]+):(\d+)>/.exec(emojiInput);
    if (!customEmoji) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(MAROON)
            .setDescription("<:Crossmark:1447578705198055484> | Only custom emojis can be stolen!"),
        ],
      });
    }

    const isAnimated = Boolean(customEmoji[1]);
    const emojiName = customEmoji[2];
    const emojiId = customEmoji[3];
    const emojiURL = `https://cdn.discordapp.com/emojis/${emojiId}.${isAnimated ? "gif" : "png"}`;

    // 🔹 Use provided name or original emoji name
    if (!name) name = emojiName;

    try {
      const added = await message.guild.emojis.create({ attachment: emojiURL, name: name });
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(MAROON)
            .setDescription(`<:TICK:1447578703335919778> | Emoji **${added.name}** has been added! ${added}`),
        ],
      });
    } catch (err) {
      console.error(err);
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(MAROON)
            .setDescription("<:Crossmark:1447578705198055484> | Failed to steal emoji. Make sure I have Manage Emojis & Stickers permission."),
        ],
      });
    }
  },
};