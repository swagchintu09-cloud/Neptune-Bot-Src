const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "stealall",
  description: "Steal multiple emojis from a replied message or from arguments.",
  category: "Moderation",
  usage: "Reply with +stealall OR +stealall <emoji1> <emoji2> ...",

  run: async (client, message, args) => {
    const MAROON = "#202225";

    if (!message.member.permissions.has(PermissionFlagsBits.ManageEmojisAndStickers)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(MAROON)
            .setDescription("<:Crossmark:1447578705198055484> | You don’t have permission to add emojis!"),
        ],
      });
    }

    let emojiMatches = [];

    // Case 1: Agar reply kiya hai
    if (message.reference) {
      const repliedMessage = await message.channel.messages.fetch(message.reference.messageId);
      emojiMatches = [...repliedMessage.content.matchAll(/<(a)?:([a-zA-Z0-9_]+):(\d+)>/g)];
    }

    // Case 2: Agar args diye gaye hai
    if (args.length > 0) {
      for (const arg of args) {
        const match = /<(a)?:([a-zA-Z0-9_]+):(\d+)>/.exec(arg);
        if (match) emojiMatches.push(match);
      }
    }

    if (emojiMatches.length === 0) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(MAROON)
            .setDescription("<:Crossmark:1447578705198055484> | No custom emojis found to steal!"),
        ],
      });
    }

    // ✅ Emoji Limit Check
    if (emojiMatches.length > 10) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(MAROON)
            .setDescription(`<:Crossmark:1447578705198055484> | You can only steal up to **10 emojis** at once! (You tried ${emojiMatches.length})`),
        ],
      });
    }

    let addedEmojis = [];
    for (const match of emojiMatches) {
      const isAnimated = Boolean(match[1]);
      const emojiName = match[2];
      const emojiId = match[3];
      const emojiURL = `https://cdn.discordapp.com/emojis/${emojiId}.${isAnimated ? "gif" : "png"}`;

      try {
        const added = await message.guild.emojis.create({ attachment: emojiURL, name: emojiName });
        addedEmojis.push(`${added} (**${added.name}**)`);
      } catch (err) {
        console.error(`❌ Failed to add emoji ${emojiName}:`, err.message);
      }
    }

    if (addedEmojis.length > 0) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(MAROON)
            .setDescription(`<:TICK:1447578703335919778> | Added emojis: ${addedEmojis.join(", ")}`),
        ],
      });
    } else {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(MAROON)
            .setDescription("<:Crossmark:1447578705198055484> | Failed to steal emojis."),
        ],
      });
    }
  },
};