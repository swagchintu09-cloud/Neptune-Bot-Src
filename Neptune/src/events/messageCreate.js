const {
  EmbedBuilder,
  PermissionsBitField,
  Collection,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  WebhookClient,
} = require("discord.js");
const MessageSchema = require("../models/MessageSchema");
const PrefixSchema = require("../models/PrefixSchema.js");
const BlacklistUserSchema = require("../models/BlacklistUserSchema.js");
const BlacklistServerSchema = require("../models/BlacklistServerSchema.js");
const NoPrefixSchema = require("../models/NoPrefixSchema.js");
const DjRoleSchema = require("../models/DjroleSchema.js");
const SetupSchema = require("../models/SetupSchema.js");
const IgnoreChannelSchema = require("../models/IgnoreChannelSchema.js");
const RestrictionSchema = require("../models/RestrictionSchema.js");
const premiumGuildSchema = require("../models/PremiumGuildSchema.js");

module.exports = async (client) => {
  if (!client.afk) client.afk = new Map();

  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (!message.guild) return; // DMs ignore

    try {
        // --- Find or Create record ---
        let data = await MessageSchema.findOne({
            guildId: message.guild.id,
            userId: message.author.id,
        });

        if (!data) {
            data = new MessageSchema({
                guildId: message.guild.id,
                userId: message.author.id,
            });
        }

        // --- Increment Counters ---
        data.allTime += 1;
        data.daily += 1;
        data.weekly += 1;
        data.lastUpdated = Date.now();

        await data.save();
    } catch (err) {
        console.error("Message logging error:", err);
    }

    // ----- AFK Remove if AFK user sends a message -----
    if (client.afk.has(message.author.id)) {
      const afkData = client.afk.get(message.author.id);
      client.afk.delete(message.author.id);

      const afkRemoveEmbed = new EmbedBuilder()
        .setDescription(
          `<:early_supporter:1447648583229640754> Welcome back ${message.author} ! You were AFK since <t:${Math.floor(
            afkData.time / 1000
          )}:R> ${afkData.mood || ""}`
        )
        .setColor("#800000");

      message.channel.send({ embeds: [afkRemoveEmbed] });
    }

    // ----- Check mentions for AFK users -----
    message.mentions.users.forEach((user) => {
      if (client.afk.has(user.id)) {
        const afkData = client.afk.get(user.id);
        const embed = new EmbedBuilder()
          .setDescription(
            `<:Author:1447651736419569704> **${user.tag}** is AFK ${afkData.mood || ""}\n<:reason:1447651738520911975> Reason: **${
              afkData.reason
            }**\n<:time:1447651740987166823> Since: <t:${Math.floor(afkData.time / 1000)}:R>`
          )
          .setColor("#800000");

        message.channel.send({ embeds: [embed] });
      }
    });

    // ----- Command System -----
    if (!message.guild || !message.id) return;

    const player = client.manager.players.get(message.guild.id);
    const updateData = await SetupSchema.findOne({ guildId: message.guild.id });
    if (updateData && updateData.channelId === message.channel.id) return;

    const isBlacklisted = await BlacklistUserSchema.findOne({
      userId: message.author.id,
    });
    if (isBlacklisted) return;

    const isServerBlacklisted = await BlacklistServerSchema.findOne({
      serverId: message.guild.id,
    });
    if (isServerBlacklisted) return;

    let prefix;
    let data = await PrefixSchema.findOne({ serverId: message.guild.id });
    prefix = data ? data.prefix : client.config.prefix;

    const npData = await NoPrefixSchema.findOne({ userId: message.author.id });
    message.guild.prefix = prefix;

    let regex = new RegExp(`<@!?${client.user.id}>`);
    let pre = message.content.match(regex)
      ? message.content.match(regex)[0]
      : prefix;
    if (!npData && !message.content.startsWith(pre)) return;

    let args = !npData
      ? message.content.slice(pre.length).trim().split(/ +/)
      : message.content.startsWith(pre)
      ? message.content.slice(pre.length).trim().split(/ +/)
      : message.content.trim().split(/ +/);

    const cmd = args.shift().toLowerCase();
    let botTag = `<@${client.user.id}>`;

    if (cmd.length === 0 && message.content === botTag) {
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Invite Me")
          .setStyle(ButtonStyle.Link)
          .setEmoji("<:invitesss:1447630604958040135>")
          .setURL(`${client.invite}`),
        new ButtonBuilder()
          .setLabel("Support Server")
          .setStyle(ButtonStyle.Link)
          .setEmoji("<:support:1447580381309177988>")
          .setURL(`${client.config.ssLink}`),
        new ButtonBuilder()
          .setLabel("Vote")
          .setStyle(ButtonStyle.Link)
          .setEmoji("<:mbot_vote:1447653201674244198>")
          .setURL(`${client.config.topGg}`)
      );

      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setAuthor({
          name: `Welcome to the Sound of ${client.user.username}`,
          iconURL: client.user.displayAvatarURL(),
        })
        .addFields([
          {
            name: `About Me`,
            value: `I am **${client.user.username}** - Your Premium Music Companion!\nDelivering **studio-grade audio** and **next-level perfomance** every time you hit play.\n\n My prefix in this server: \`${prefix}\`\n Try \`${prefix}help\` to see what can I do.`,
          },
          {
            name: `Settings`,
            value: `Server Id: ${message.guild.id}\nGuild Prefix: ${prefix}`,
          },
        ])
        .setFooter({
          text: `Developed with ❤️ by The Predator </>`,
          iconURL:
            "https://images-ext-1.discordapp.net/external/cF9XR74C17g1ZUGoZD_cRD4Frb3w1On1vMYDE_gqacg/%3Fsize%3D2048/https/cdn.discordapp.com/avatars/354455090888835073/c079f8def649b58cb549a01d9da3d51d.webp?format=webp",
        });
      return message.reply({ embeds: [embed], components: [row] });
    }

    const command =
      client.mcommands.get(cmd) ||
      client.mcommands.find(
        (cmds) => cmds.aliases && cmds.aliases.includes(cmd)
      );
    if (!command) return;

    // ----- Premium Check -----
    if (command.premium) {
      const premiumData = await premiumGuildSchema.findOne({
        Guild: message.guild.id,
      });

      if (!premiumData) {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.color)
              .setTitle("Premium Required")
              .setDescription(
                `Hello, ${message.author}\nYou have Just discovered a [premium](https://discord.gg/RbyBv2GsTn) command, This command is only accessible to premium only members. Upgrade to Premium to Access Exclusive Features and commands, check it out!`
              ),
          ],
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setURL("https://discord.gg/RbyBv2GsTn")
                .setLabel("Premium")
            ),
          ],
        });
      }

      if (!premiumData.Permanent && Date.now() > premiumData.Expire) {
        const expiredDuration = Math.floor(
          (Date.now() - premiumData.Expire) / (1000 * 60 * 60 * 24)
        );

        await premiumGuildSchema.deleteOne({ Guild: message.guild.id });

        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.color)
              .setDescription(
                `Your Premium Subscription expired ${expiredDuration} days ago! Please renew to continue accessing premium features.`
              ),
          ],
        });
      }
    }

    // ----- Cooldowns -----
    if (!client.config.ownerIDS.includes(message.author.id)) {
      if (!client.cooldowns) {
        client.cooldowns = new Collection();
      }
      if (!client.cooldowns.has(command.name)) {
        client.cooldowns.set(command.name, new Collection());
      }

      const now = Date.now();
      const timestamps = client.cooldowns.get(command.name);
      const cooldownAmount = (command.cooldown ? command.cooldown : 5) * 1000;

      if (timestamps.has(message.author.id)) {
        const expirationTime =
          timestamps.get(message.author.id) + cooldownAmount;
        if (now < expirationTime) {
          const timeLeft = (expirationTime - now) / 1000;
          let commandCount = timestamps.get(`${message.author.id}_count`) || 0;
          commandCount++;
          timestamps.set(`${message.author.id}_count`, commandCount);

          if (commandCount > 5) {
            const checkisBlacklisted = await BlacklistUserSchema.findOne({
              userId: message.author.id,
            });
            if (!checkisBlacklisted) {
              await BlacklistUserSchema.create({ userId: message.author.id });
              const saixd = new EmbedBuilder()
                .setColor(client.color)
                .setTitle("Blacklisted for Spamming")
                .setDescription(
                  `You have been blacklisted for spamming commands. Please refrain from such behavior\nArgo Antispam System | No one Can Bypass This!`
                )
                .addFields({
                  name: "Support Server",
                  value: "[Join our support server](https://discord.gg/RbyBv2GsTn)",
                  inline: true,
                })
                .setTimestamp();
              return message.channel.send({ embeds: [saixd] });
            }
          }

          if (!timestamps.has(`${message.author.id}_cooldown_message_sent`)) {
            message.channel
              .send({
                embeds: [
                  new EmbedBuilder()
                    .setColor(client.color)
                    .setDescription(
                      `Please wait, this command is on cooldown for \`${timeLeft.toFixed(
                        1
                      )}s\``
                    ),
                ],
              })
              .then((msg) => {
                setTimeout(() => msg.delete().catch(() => {}), 5000);
              });
            timestamps.set(
              `${message.author.id}_cooldown_message_sent`,
              true
            );
          }

          return;
        }
      }

      timestamps.set(message.author.id, now);
      timestamps.set(`${message.author.id}_count`, 1);
      setTimeout(() => {
        timestamps.delete(message.author.id);
        timestamps.delete(`${message.author.id}_count`);
        timestamps.delete(`${message.author.id}_cooldown_message_sent`);
      }, cooldownAmount);
    }

    // ----- Permissions -----
    if (
      command.userPermissions &&
      !message.member.permissions.has(
        PermissionsBitField.resolve(command.userPermissions)
      )
    ) {
      const embed = new EmbedBuilder()
        .setDescription(
          `<:Crossmark:1447578705198055484> | You don't have enough Permissions !!`
        )
        .setColor(client.config.color);
      return message.reply({ embeds: [embed] });
    }
    if (
      command.botPermissions &&
      !message.guild.members.me.permissions.has(
        PermissionsBitField.resolve(command.botPermissions)
      )
    ) {
      const embed = new EmbedBuilder()
        .setDescription(
          `<:Crossmark:1447578705198055484> | I don't have enough Permissions !!`
        )
        .setColor(client.config.color);
      return message.reply({ embeds: [embed] });
    }
    if (command.inVc && !message.member.voice.channel) {
      const embed = new EmbedBuilder()
        .setDescription(
          "<:Crossmark:1447578705198055484> | You need to be in a voice channel to use this command!"
        )
        .setColor(client.config.color);
      return message.reply({ embeds: [embed] });
    }
    if (
      command.sameVc &&
      message.guild.members.me.voice.channel &&
      message.member.voice.channelId !==
        message.guild.members.me.voice.channel.id
    ) {
      const embed = new EmbedBuilder()
        .setColor(client.config.color)
        .setDescription(
          `<:Crossmark:1447578705198055484> | I'm not in the same voice channel as you!`
        );
      return message.reply({ embeds: [embed] });
    }

    // ----- Vote Only -----
    if (command.voteOnly && client.config.vote) {
      let vote = await client.topgg.hasVoted(message.author.id);

      if (!vote) {
        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel("Click here")
            .setStyle(ButtonStyle.Link)
            .setURL(`${client.config.topGg}/vote`)
        );

        const embed = new EmbedBuilder()
          .setColor(client.color)
          .setDescription(
            `If you want to use **${command.name}** command you just need to vote me in Top.gg`
          );

        return message.channel.send({ embeds: [embed], components: [row] });
      }
    }

    // ----- Owner Only -----
    if (command.ownerOnly) {
      let owner = client.config.ownerIDS.includes(message.author.id);

      if (!owner) {
        const embed = new EmbedBuilder()
          .setColor(client.color)
          .setDescription(
            "<:Crossmark:1447578705198055484> | It's a owner only command you can't use this command!"
          );
        return message.channel.send({ embeds: [embed] });
      }
    }

    // ----- DJ Role -----
    const djData = await DjRoleSchema.findOne({ guildId: message.guild.id });

    if (command.dj && djData) {
      const role = message.guild.roles.cache.get(djData.roleId);
      const member = message.guild.members.cache.get(message.author.id);
      try {
        if (!role) {
          const embed = new EmbedBuilder()
            .setColor(client.color)
            .setDescription(
              "<:Crossmark:1447578705198055484> | The DJ role could not be found. It may have been deleted. Please check the server settings."
            );
          return message.channel.send({ embeds: [embed] });
        }

        if (!member.roles.cache.has(role.id)) {
          const embed = new EmbedBuilder()
            .setColor(client.color)
            .setDescription(
              "<:Crossmark:1447578705198055484> | You do not have the required DJ role to use this command."
            );
          return message.channel.send({ embeds: [embed] });
        }
      } catch (error) {
        console.error("Error fetching DJ role data:", error);
      }
    }

    // ----- Restrictions -----
    const restrictionData = await RestrictionSchema.findOne({
      guildId: message.guild.id,
    });

    if (restrictionData) {
      if (
        restrictionData.restrictedTextChannels.includes(message.channel.id)
      ) {
        const embed = new EmbedBuilder()
          .setColor(client.config.color)
          .setDescription(
            "<:warn:1447578710155985041> | This text channel is restricted and you cannot use commands here!"
          );

        const restrictedMessage = await message.reply({ embeds: [embed] });
        setTimeout(
          () => restrictedMessage.delete().catch(console.error),
          10000
        );
        return;
      }

      if (
        message.member.voice.channelId &&
        restrictionData.restrictedVoiceChannels.includes(
          message.member.voice.channelId
        )
      ) {
        const embed = new EmbedBuilder()
          .setColor(client.config.color)
          .setDescription(
            "<:warn:1447578710155985041> | You are in a restricted voice channel and cannot use commands!"
          );

        const restrictedMessage = await message.reply({ embeds: [embed] });
        setTimeout(
          () => restrictedMessage.delete().catch(console.error),
          10000
        );
        return;
      }
    }

    // ----- Ignore Channels -----
    const isChannelIgnored = await IgnoreChannelSchema.findOne({
      guildId: message.guild.id,
      channelId: message.channel.id,
    });

    if (isChannelIgnored) {
      const embed = new EmbedBuilder()
        .setColor(client.config.color)
        .setDescription(
          "<:Crossmark:1447578705198055484> | This Channel is in my Ignore List, You can't use my commands here!"
        );

      const ignoredMessage = await message.reply({ embeds: [embed] });
      setTimeout(() => ignoredMessage.delete().catch(console.error), 10000);
      return;
    }

    // ----- Command Execution -----
    try {
      if (command.execute) {
        await command.execute(message, args, client, prefix);
      } else if (command.run) {
        await command.run(client, message, args, prefix, player);
      } else {
        throw new Error("Command handler not found.");
      }
    } catch (error) {
      console.error(error);
      const embed = new EmbedBuilder()
        .setColor(client.config.color)
        .setDescription(
          `<:Crossmark:1447578705198055484> There was an error while executing the command.`
        );
      message.reply({ embeds: [embed] });
    }

    // ----- Command Logs -----
    const commandlogs = new WebhookClient({ url: `${client.config.cmd_log}` });
    commandlogs.send({
      embeds: [
        new EmbedBuilder()
          .setTitle(`Command Logs`)
          .setColor(client.color)
          .setAuthor({
            name: `${client.user.username}`,
            iconURL: client.user.displayAvatarURL(),
          })
          .addFields([
            {
              name: `Information`,
              value: `Command Author: ${message.author.tag}\nCommand Name: \`${command.name}\`\nChannel Id: ${message.channel.id}\nChannel Name: ${message.channel.name}\nGuild Name: ${message.guild.name}\nGuild Id: ${message.guild.id}`,
            },
          ])
          .setThumbnail(message.guild.iconURL({ dynamic: true })),
      ],
    });
  });
};