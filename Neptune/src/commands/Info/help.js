const {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  Message,
} = require("discord.js");

module.exports = {
  name: "help",
  aliases: ["h"],
  description: "help command",
  category: "Info",
  cooldown: 5,
  run: async (client, message, args, prefix) => {
    let invite = `https://discord.com/oauth2/authorize?client_id=1447288293052907741&permissions=8&integration_type=0&scope=bot`;
    let support = `https://discord.gg/RbyBv2GsTn`;
    let vote = ``;

    // Music
    let em1 = new EmbedBuilder()
      .setColor("#202225")
      .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })
      .setDescription(
        `## [Music Commands](${support})\n` +
        "`autoplay`, `clear`, `disconnect`, `join`, `loop`, `lyrics`, `nowplaying`, `pause`, `play`, `queue`, `remove`, `replay`, `resume`, `search`, `seek`, `shuffle`, `skip`, `stop`, `volume`"
      )
      .setImage("https://media.discordapp.net/attachments/1447289843867713558/1447610796224807002/MUSIC_COMMANDS.gif?ex=6938401d&is=6936ee9d&hm=484ceb610904a46acd7f1c3b3ff50e210515a40b7185da00b7aa646dbc5ef994&=");

    // Filters
    let em2 = new EmbedBuilder()
      .setColor("#202225")
      .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })
      .setDescription(
        `## [Filter Commands](${support})\n` +
        "`3d`, `alien`, `ambient`, `bass`, `bassboost`, `chill`, `china`, `chipmuk`, `dance`, `darthvader`, `daycore`, `doubletime`, `haunted`, `lofi`, `muffled`, `nightcore`, `reset`, `slowed`, `soft`, `softfocus`, `softguitar`, `cosmic`, `underwater`, `warmpad`"
      )
      .setImage("https://media.discordapp.net/attachments/1447289843867713558/1447612281805602887/FILTER_COMMANDS.gif?ex=6938417f&is=6936efff&hm=9f26148b6756162a3ed75fd64ab7c110424e82d17d4ff111766181f5a9e1c3c6&=");

    // Settings
    let em3 = new EmbedBuilder()
      .setColor("#202225")
      .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })
      .setDescription(
        `## [Setting Commands](${support})\n` +
        "`247`, `djrole`, `ignorechannel`, `prefix`, `restrict`, `setup`, `setupplayer`, `unrestrict`"
      )
      .setImage("https://media.discordapp.net/attachments/1447289843867713558/1447612376357539893/SETTING_COMMANDS.gif?ex=69384195&is=6936f015&hm=69ec881507cd59d695611fcfc48c95a29381c32ec6b2bb14728c060477447a31&=");

    // Info
    let em4 = new EmbedBuilder()
      .setColor("#202225")
      .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })
      .setDescription(
        `## [Info Commands](${support})\n` +
        "`profile`, `help`, `ping`, `stats`, `team`, `uptime`,"
      )
      .setImage("https://media.discordapp.net/attachments/1447289843867713558/1447613228426461254/standard.gif?ex=69384261&is=6936f0e1&hm=b4412ff09a0f6527590fa2ce647e4a7ca16dd1d79e0e3ec28bb5d7d0a0793420&=");

    // Misc
    let em5 = new EmbedBuilder()
      .setColor("#202225")
      .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })
      .setDescription(
        `## [Fun Commands](${support})\n` +
        "`adance`, `blush`, `bonk`, `cat`, `cry`, `cuddle`, `dare`, `hug`, `kill`, `pat`, `poke`, `punch`, `roast`, `rps`, `ship`, `slap`, `truth`, `wink`, `wouldyourather`"
      )
      .setImage("https://media.discordapp.net/attachments/1447289843867713558/1447613706341978266/FUN_COMMANDS.gif?ex=693842d2&is=6936f152&hm=b35a1bacdf3168b882f69d3906a24665e83bc570203830eb9e02a3de3d44f694&=");

    // Custom Roles
    let em7 = new EmbedBuilder()
      .setColor("#202225")
      .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })
      .setDescription(
        `## [Custom Roles](${support})\n` +
        "`rolesetup`, `rolesetup add`, `rolesetup remove`, `rolesetup config`, `rolesetup reset`, `rolesetup list`, `rolesetup reqrole`"
      )
      .setImage("https://media.discordapp.net/attachments/1447289843867713558/1447614447123300527/custom_roles.gif?ex=69384383&is=6936f203&hm=fd2a153a78841ebd8439dd59874274c60dd35140aa1747ea35b6a44773d97ae4&=");

    // Moderation
    let em8 = new EmbedBuilder()
      .setColor("#202225")
      .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })
      .setDescription(
        `## [Moderation Commands](${support})\n` +
        "`ban`, `clearwarn`, `hide`, `hideall`, `kick`, `lock`, `lockall`, `mute`, `nick`, `purge`, `purgebot`, `role`, `roleicon`, `say`, `slowmode`, `snipe`, `steal`, `stealall`, `stickersteal`, `unban`, `unbanall`, `unhide`, `unhideall`, `unlock`, `unlockall`, `unmute`, `unmuteall`, `warn`"
      )
      .setImage("https://media.discordapp.net/attachments/1447289843867713558/1447617996251074714/MODERATION_COMMANDS.gif?ex=693846d1&is=6936f551&hm=7478d3da6acbc69e74a411effa2405268b440ddfe898340c0e2bc49c0e38d69e&=");

    // Voice
    let em9 = new EmbedBuilder()
      .setColor("#202225")
      .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })
      .setDescription(
        `## [Voice Commands](${support})\n` +
        "`vcdeafen`, `vcdeafenall`, `vckick`, `vckickall`, `vclist`, `vcmove`, `vcmoveall`, `vcmute`, `vcmuteall`, `vcundeafen`, `vcundeafenall`, `vcunmute`, `vcunmuteall`"
      )
      .setImage("https://media.discordapp.net/attachments/1447289843867713558/1447615962336460930/standard.gif?ex=693844ec&is=6936f36c&hm=7387f84b547fdfdec2d246dca3e58c8c537e0eb8615a67d08f24c6565cd9fc14&=");

    // Utility
    let em10 = new EmbedBuilder()
      .setColor("#202225")
      .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })
      .setDescription(
        `## [Utility Commands](${support})\n` +
        "`afk`, `avatar`, `banner`, `boostcount`, `membercount`, `roleinfo`, `serverbanner`, `servericon`, `serverinfo`, `userinfo`"
      )
      .setImage("https://media.discordapp.net/attachments/1447289843867713558/1447616553414819870/Utility_Commands.gif?ex=69384579&is=6936f3f9&hm=b522cc54da871a7322dd8d1adf77d55553eb2045c128a845a78091da8b7fc05a&=");

    // Giveaway
    let em11 = new EmbedBuilder()
      .setColor("#202225")
      .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })
      .setDescription(
        `## [Giveaway Commands](${support})\n` +
        "`gstart`, `gend`, `greroll`, `glist`"
      )
      .setImage("https://media.discordapp.net/attachments/1447289843867713558/1447617077228732497/Giveaway_Commands.gif?ex=693845f6&is=6936f476&hm=ef69de9992f99d2c5c5f6a3d069571726e2ea0f025a87d04aa15d7734a02ba46&=");

    // All Commands
    let em6 = new EmbedBuilder()
      .setColor("#202225")
      .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })
      .setDescription(
        `## [「 All Commands 」\n\n` +
        `** 1. [Music Commands](${support})**` +
        "`autoplay`, `clear`, `disconnect`, `join`, `loop`, `lyrics`, `nowplaying`, `pause`, `play`, `queue`, `remove`, `replay`, `resume`, `search`, `seek`, `shuffle`, `skip`, `stop`, `volume`\n" +
        `**2. [Filters Commands](${support})**` +
        "`3d`, `alien`, `ambient`, `bass`, `bassboost`, `chill`, `china`, `chipmuk`, `dance`, `darthvader`, `daycore`, `doubletime`, `haunted`, `lofi`, `muffled`, `nightcore`, `reset`, `slowed`, `soft`, `softfocus`, `softguitar`, `cosmic`, `underwater`, `warmpad`\n" +
        `**3. [Setting Commands](${support})**` +
        "`247`, `djrole`, `ignorechannel`, `prefix`, `restrict`, `setup`, `setupplayer`, `unrestrict`\n" +
        `**4. [Info Commands](${support})**` +
        "`profile`, `help`, `ping`, `stats`, `team`, `uptime`\n" +
        `**5. [Fun Commands](${support})**` +
        "`adance`, `blush`, `bonk`, `cat`, `cry`, `cuddle`, `dare`, `hug`, `kill`, `pat`, `poke`, `punch`, `roast`, `rps`, `slap`, `ship`, `truth`, `tictactoe`, `wink`, `wouldyourather`\n" +
        `**6. [Custom Roles](${support})**` +
        "`rolesetup`, `rolesetup add`, `rolesetup remove`, `rolesetup config`, `rolesetup reset`, `rolesetup list`, `rolesetup reqrole`\n" +
        `**7. [Moderation Commands](${support})**` +
        "`ban`, `clearwarn`, `hide`, `hideall`, `kick`, `lock`, `lockall`, `mute`, `nick`, `purge`, `purgebot` `role`, `roleicon`, `say`, `slowmode`, `snipe`, `steal`, `stealall`, `stickersteal`, `unban`, `unbanall`, `unhide`, `unhideall`, `unlock`, `unlockall`, `unmute`, `unmuteall`, `warn`\n" +
        `**8. [Voice Commands](${support})**` +
        "`vcdeafen`, `vcdeafenall`, `vckick`, `vckickall`, `vclist`, `vcmove`, `vcmoveall`, `vcmute`, `vcmuteall`, `vcundeafen`, `vcundeafenall`, `vcunmute`, `vcunmuteall`\n" +
        `**9. [Utility Commands](${support})**` +
        "`afk`, `avatar`, `banner`, `boostcount`, `membercount`, `roleinfo`, `serverbanner`, `servericon`, `serverinfo`, `translate`, `userinfo`\n" +
        `**10. [Giveaway Commands](${support})**` +
        "`gstart`, `gend`, `greroll`, `glist`"
      );

    if (!args[0]) {
      let em = new EmbedBuilder()
        .setColor("#202225")
        .setAuthor({
          name: `${client.user.username} Help Menu`,
          iconURL: client.user.displayAvatarURL(),
        })
        .setURL("https://discord.gg/RbyBv2GsTn")
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
        .setDescription(
          `- **My Prefix is: \`${prefix}**\`\n- **Total Commands: ${client.mcommands.size}**\n- **[Invite](${invite})** | **[Support](${client.config.ssLink})** | **[Website](https://docs.argomusic.xyz)**`
        )
        .addFields({
          name: `<:folders:1447587768745066506> __**Categories:**__`,
          value: `<:music:1447587771219705981> \`:\` **Music** \n<:filter:1447587773749133344> \`:\` **Filters** \n<:setting:1447587775657414748> \`:\` **Settings** \n<:info:1447587778845212824> \`:\` **Information** \n<:Fav:1447587948227854398> \`:\` **Fun** \n<:roles:1447587950396178472> \`:\` **Custom Roles** \n<:Moderation:1447587953000845382> \`:\` **Moderation** \n<:Volume_up:1447587955115036834> \`:\` **Voice** \n<:utilitye:1447587957497139241> \`:\` **Utility** \n<:giveaway:1447588112392912958> \`:\` **Giveaway** \n<:AllCommands:1447588114557046874> \`:\` **All Commands**`,
        })
        .setImage("https://media.discordapp.net/attachments/1447289843867713558/1447610070501294272/home.gif?ex=69383f70&is=6936edf0&hm=2f74e896a30bede2a4524ca6f200747675c64ebce256d51cd474db7c2d24551d&=")
        .setFooter({
          text: `Requested by ${message.author.tag}`,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        });

      let menu = new StringSelectMenuBuilder()
        .setPlaceholder(`🎧 | Select to view the commands.`)
        .setCustomId(`help`)
        .addOptions([
          { label: `Home`, description: `Navigate to Home Page`, value: `help-home`, emoji: `<:home:1447588116876623952>` },
          { label: `Music`, description: `Check Commands under Music category`, value: `help-music`, emoji: `<:music:1447587771219705981>` },
          { label: `Filters`, description: `Check Commands under Filters category`, value: `help-filters`, emoji: `<:filter:1447587773749133344>` },
          { label: `Setting`, description: `Check Commands under Setting category`, value: `help-config`, emoji: `<:setting:1447587775657414748>` },
          { label: `Information`, description: `Check Commands under Information category`, value: `help-info`, emoji: `<:info:1447587778845212824>` },
          { label: `Fun`, description: `Check Commands under Fun category`, value: `help-fun`, emoji: `<:Fav:1447587948227854398>` },
          { label: `Custom Roles`, description: `Check Commands under Custom Roles category`, value: `help-roles`, emoji: "<:roles:1447587950396178472>" },
          { label: `Moderation`, description: `Check Commands under Moderation category`, value: `help-mod`, emoji: "<:Moderation:1447587953000845382>" },
          { label: `Voice`, description: `Check Commands under Voice category`, value: `help-voice`, emoji: "<:Volume_up:1447587955115036834>" },
          { label: `Utility`, description: `Check Commands under Utility category`, value: `help-util`, emoji: "<:utilitye:1447587957497139241>" },
          { label: `Giveaway`, description: `Check Commands under Giveaway category`, value: `help-gwys`, emoji: "<:giveaway:1447588112392912958>" },
          { label: `All Commands`, description: `Check Commands of All categories`, value: `help-allcmds`, emoji: "<:AllCommands:1447588114557046874>" },
        ]);

      let ro = new ActionRowBuilder().addComponents(menu);
      let b1 = new ButtonBuilder().setStyle(ButtonStyle.Success).setCustomId(`m1`).setEmoji("<:home:1447588116876623952>");
      let b3 = new ButtonBuilder().setStyle(ButtonStyle.Danger).setCustomId(`close`).setEmoji(`<:Delete:1447588119301062696>`);
      let b2 = new ButtonBuilder().setStyle(ButtonStyle.Secondary).setLabel("All Commands").setCustomId(`m2`).setEmoji("<:AllCommands:1447588114557046874>");

      const button = new ActionRowBuilder().addComponents(b1, b3, b2);

      let msg = await message.channel.send({ embeds: [em], components: [button, ro] });

      let collector = await msg.createMessageComponentCollector({
        filter: (interaction) => interaction.user.id === message.author.id && interaction.message.id === msg.id,
        time: 100000 * 4,
        idle: 100000 * 2,
      });

      collector.on("collect", async (interaction) => {
        if (interaction.isStringSelectMenu()) {
          switch (interaction.values[0]) {
            case "help-home": await interaction.update({ embeds: [em] }); break;
            case "help-music": await interaction.update({ embeds: [em1] }); break;
            case "help-filters": await interaction.update({ embeds: [em2] }); break;
            case "help-config": await interaction.update({ embeds: [em3] }); break;
            case "help-info": await interaction.update({ embeds: [em4] }); break;
            case "help-fun": await interaction.update({ embeds: [em5] }); break;
            case "help-roles": await interaction.update({ embeds: [em7] }); break;
            case "help-mod": await interaction.update({ embeds: [em8] }); break;
            case "help-voice": await interaction.update({ embeds: [em9] }); break;
            case "help-util": await interaction.update({ embeds: [em10] }); break;
            case "help-gwys": await interaction.update({ embeds: [em11] }); break;
            case "help-allcmds": await interaction.update({ embeds: [em6] }); break;
          }
        } else if (interaction.isButton()) {
          switch (interaction.customId) {
            case "m1": await interaction.update({ embeds: [em] }); break;
            case "m2": await interaction.update({ embeds: [em6] }); break;
            case "close":
              await interaction.reply({ content: "<:loading:1447588171096522977> Closing the interface...", ephemeral: true });
              await msg.delete().catch(() => {});
              collector.stop();
              break;
          }
        }
      });

      collector.on("end", async () => {
        const disabledButtons = new ActionRowBuilder().addComponents(
          b1.setDisabled(true), b2.setDisabled(true), b3.setDisabled(true)
        );
        const disabledMenu = new ActionRowBuilder().addComponents(menu.setDisabled(true));
        await msg.edit({ components: [disabledButtons, disabledMenu] }).catch(() => {});
      });
    }
  },
};