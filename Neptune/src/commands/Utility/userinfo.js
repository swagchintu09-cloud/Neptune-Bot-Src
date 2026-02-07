const { EmbedBuilder, PermissionsBitField, UserFlagsBitField } = require("discord.js");

module.exports = {
  name: "userinfo",
  aliases: ["ui"],
  category: "Utility",
  description: "Shows information about a user.",
  run: async (client, message, args) => {
    try {
      let user;

      // Mention
      if (message.mentions.users.first()) {
        user = message.mentions.users.first();
      }
      // User ID
      else if (args[0]) {
        try {
          user = await client.users.fetch(args[0]);
        } catch {
          return message.reply("<:Crossmark:1447578705198055484> Invalid User ID.");
        }
      }
      // Default: author
      else {
        user = message.author;
      }

      const fetchedUser = await client.users.fetch(user.id, { force: true });
      const member = await message.guild.members.fetch(user.id).catch(() => null);

      // Badges emojis mapping
      const badgeEmojis = {
        Owner: "<:owner:1447648124309864582>",
        Admin: "<:admin:1447648126008561766>",
        Developer: "<:developer:1447648127250337953>",
        Staff: "<:Staff:1447648129611464847>",
        Partner: "<:partner:1447648131876655207>",
        HypeSquad: "<:hypesqaudevents:1447648364048158861>",
        BugHunterLevel1: "<:BugHunter:1447648365981597758>",
        BugHunterLevel2: "<:bug_hunter:1447648368330281164>",
        HypeSquadOnlineHouse1: "<:house_bravery:1447648370364776458>",
        HypeSquadOnlineHouse2: "<:house_brilliance:1447648372583305296>",
        HypeSquadOnlineHouse3: "<:house_balance:1447648581078225073>",
        PremiumEarlySupporter: "<:early_supporter:1447648583229640754>",
        ActiveDeveloper: "<:active_developer:1447648586287419393>",
        VerifiedBot: "<:verified_bot:1447648588019536054>",
        VerifiedDeveloper: "<:verified_developer:1447648590423003218>"
      };

      // Flags (Badges)
      const badges = new UserFlagsBitField(fetchedUser.flags?.bitfield).toArray();
      const badgeList = badges.length
        ? badges.map(b => badgeEmojis[b] || "").join(" ") // Only emojis
        : "None"; // Display "None" if no badges

      // Created / Joined
      const createdAt = `<t:${Math.floor(fetchedUser.createdTimestamp / 1000)}:R>`;
      const joinedAt = member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : "Not in this server";

      // Roles
      const roles = member
        ? member.roles.cache.filter(r => r.id !== message.guild.id).map(r => r.toString())
        : [];
      const roleList = roles.length ? roles.join(", ") : "None";

      // Highest Role
      const highestRole = member ? member.roles.highest : "None";

      // Key Permissions
      const keyPerms = member ? member.permissions.toArray().join(", ") || "None" : "N/A";

      const embed = new EmbedBuilder()
        .setAuthor({
          name: `${fetchedUser.username}'s Information`,
          iconURL: fetchedUser.displayAvatarURL({ dynamic: true })
        })
        .setThumbnail(fetchedUser.displayAvatarURL({ dynamic: true, size: 1024 }))
        .setColor("#202225") // Maroon
        .addFields(
          {
            name: "__General Information__",
            value: `**User Name :** ${fetchedUser.username}\n**User Id :** ${fetchedUser.id}\n**Discriminator :** ${fetchedUser.discriminator}\n**Nickname :** ${member?.nickname || "None"}\n**Type :** ${fetchedUser.bot ? "Bot" : "Human"}\n**Discord Badges :** ${badgeList}\n**Account Created :** ${createdAt}\n**Joined On :** ${joinedAt}`,
            inline: false
          },
          {
            name: "__Roles Info__",
            value: `**Highest Role :** ${highestRole}\n**Roles [${roles.length}] :** ${roleList}`,
            inline: false
          },
          {
            name: "__Key Permissions__",
            value: keyPerms,
            inline: false
          }
        )
        .setFooter({
          text: `Requested By : ${message.author.username}`,
          iconURL: message.author.displayAvatarURL({ dynamic: true })
        })
        .setTimestamp();

      // Banner show if exists
      if (fetchedUser.banner) {
        embed.setImage(fetchedUser.bannerURL({ dynamic: true, size: 1024 }));
      }

      message.channel.send({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      message.reply("<:Crossmark:1447578705198055484> Error fetching user info!");
    }
  }
};