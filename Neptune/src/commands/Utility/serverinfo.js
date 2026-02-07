const {
  EmbedBuilder,
  ChannelType
} = require("discord.js");

module.exports = {
  name: "serverinfo",
  aliases: ["si"],
  category: "Utility",
  description: "Shows information about the server.",
  run: async (client, message, args) => {
    try {
      const { guild } = message;

      // Owner
      const owner = await guild.fetchOwner();

      // Created At (Relative Timestamp)
      const createdAt = `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`;

      // Channels Count
      const textChannels = guild.channels.cache.filter(c => c.type === ChannelType.GuildText).size;
      const voiceChannels = guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice).size;
      const totalChannels = textChannels + voiceChannels;

      // Emojis
      const regularEmojis = guild.emojis.cache.filter(e => !e.animated).size;
      const animatedEmojis = guild.emojis.cache.filter(e => e.animated).size;
      const totalEmojis = guild.emojis.cache.size;

      // Boost
      const boostLevel = guild.premiumTier;
      const boostCount = guild.premiumSubscriptionCount;

      // ✅ Roles (ignore @everyone)
      const roles = guild.roles.cache.filter(r => r.id !== guild.id);
      const roleCount = roles.size;

      const embed = new EmbedBuilder()
        .setAuthor({ name: `${guild.name}'s Information`, iconURL: guild.iconURL({ dynamic: true }) })
        .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }))
        .setColor("#202225")
        .addFields(
          {
            name: "__About__",
            value: `**Name:** ${guild.name}\n**ID:** ${guild.id}\n**Owner <:crowns:1447646459670302751>:** ${owner.user} \`(${owner.id})\`\n**Created at:** ${createdAt}\n**Members:** ${guild.memberCount}\n**Banned Members:** ${guild.bans.cache.size || 0}`,
            inline: false
          },
          {
            name: "__Server Information__",
            value: `**Verification Level:** ${guild.verificationLevel}\n**Inactive Channel:** ${guild.afkChannel ? guild.afkChannel : "<:Crossmark:1447578705198055484>"}\n**Inactive Timeout:** ${guild.afkTimeout / 60} mins\n**System Messages Channel:** ${guild.systemChannel ? guild.systemChannel : "<:Crossmark:1447578705198055484>"}\n**Boost Bar Enabled:** ${guild.premiumProgressBarEnabled ? "<:enable:1447578795115675679>" : "<:disabled:1447578796340547735>"}`,
            inline: false
          },
          {
            name: "__Description__",
            value: guild.description || "No server description.",
            inline: false
          },
          {
            name: "__Channels__",
            value: `**Total:** ${totalChannels}\n**Channels:** <:text:1447646462585471029> ${textChannels} | <:Voice_Channel:1447646467182432426> ${voiceChannels}`,
            inline: false
          },
          {
            name: "__Emoji Info__",
            value: `**Regular:** ${regularEmojis}\n**Animated:** ${animatedEmojis}\n**Total:** ${totalEmojis}`,
            inline: false
          },
          {
            name: "__Boost Status__",
            value: `**Level ${boostLevel}** [<:booster_op:1447646465085407335> ${boostCount} Boosts]`,
            inline: false
          },
          {
            name: `__Server Roles__ [${roleCount}]`,
            value: roleCount > 20 ? "Too many roles to show.." : roles.map(r => r).join(", "),
            inline: false
          }
        )
        .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();

      message.channel.send({ embeds: [embed] });
    } catch (e) {
      console.error(e);
      message.reply("<:Crossmark:1447578705198055484> There was an error while fetching server info.");
    }
  }
};