/** @format
 *
 * Team Command by Dakshh
 *
 */

const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
} = require("discord.js");

module.exports = {
  name: "team",
  category: "Info",
  aliases: ["team"],
  description: "See information about this project.",
  args: false,
  usage: "",
  owner: false,
  cooldown: 3,

  execute: async (message, args, client, prefix) => {
    // 👇 Replace with actual Discord IDs
    const dakshh = await client.users.fetch("354455090888835073");
    const jiyuu = await client.users.fetch("354455090888835073");
    const diuuu = await client.users.fetch("354455090888835073");
    const keshu = await client.users.fetch("354455090888835073");

    const embedt = new EmbedBuilder()
      .setAuthor({
        name: `${client.user.username}'s Team`,
        iconURL: client.user.displayAvatarURL({ dynamic: true, size: 2048 }),
      })
      .setDescription(
        `> Namaskar **[${message.author.displayName}](https://discord.com/users/${message.author.id})** \n> Meet your all-in-one digital assistant – versatile, intelligent, and always ready to make your tasks easier and interactions smoother.`,
      )
      .setImage("https://media.discordapp.net/attachments/1447289843867713558/1447635991144828990/ULTRA_DEVELOPMENT.gif?ex=69385794&is=69370614&hm=8e4472289abe6d9e89bc9bcdc16b5e2699819d4ca4a90343f6df21d10dcb34ca&=")
      .setColor("#202225")
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setFooter({
        text: `Requested by ${message.author.username}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      });

    const backBtn = new ActionRowBuilder().addComponents([
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("back")
        .setEmoji("1415749049340006400"),
    ]);

    const devsMenu = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("teamm")
        .setPlaceholder("Ultra Development <3")
        .addOptions([
          {
            label: dakshh.globalName || dakshh.username,
            value: "Predator",
            description: "Info About My Developer!",
            emoji: "1416690114784002078",
          },
          {
            label: jiyuu.globalName || jiyuu.username,
            value: "Predator",
            description: "Info About Owner!",
            emoji: "1416689895358857287",
          },
          {
            label: diuuu.globalName || diuuu.username,
            value: "Predator",
            description: "Info About Founder!",
            emoji: "1416690587784052826",
          },
          {
            label: keshu.globalName || keshu.username,
            value: "Predator",
            description: "Info About Co Owner!",
            emoji: "1415988781986742345",
          },
        ]),
    );

    const msg = await message.channel.send({
      embeds: [embedt],
      components: [devsMenu],
    });

    const collector = msg.createMessageComponentCollector({
      filter: (i) => {
        if (i.user.id !== message.author.id) {
          i.reply({
            content: `${client.emoji.cross} | That's not your session. Run \`${prefix}team\` to create your own.`,
            ephemeral: true,
          });
          return false;
        }
        return true;
      },
      time: 100000,
    });

    // Embeds for each member
    const dakshhEmbed = new EmbedBuilder()
      .setThumbnail(dakshh.displayAvatarURL())
      .setAuthor({
        name: "Info About Predator",
        iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }),
      })
      .setFooter({
        text: `Thanks For Using Me <3`,
        iconURL: message.author.displayAvatarURL(),
      })
      .setDescription(
        `> \<:developer:1447630011489058938> **__Developer__**\n> - [@${dakshh.globalName || dakshh.username}](https://discord.com/users/${dakshh.id})\n> **ID:** \`${dakshh.id}\`\n\n> <:invitesss:1447630604958040135> **__Socials__**\n> [Instagram](https://www.instagram.com/predatororg/), [Support]()`,
      )
      .setColor("#2f3136")
      .setTimestamp();

    const jiyuuEmbed = new EmbedBuilder()
      .setThumbnail(jiyuu.displayAvatarURL())
      .setAuthor({
        name: "Info About Predator",
        iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }),
      })
      .setFooter({
        text: `Thanks For Using Me <3`,
        iconURL: message.author.displayAvatarURL(),
      })
      .setDescription(
        `> <:owner:1447631082794127432> **__Owner__**\n> - [@${jiyuu.globalName || jiyuu.username}](https://discord.com/users/${jiyuu.id})\n> **ID:** \`${jiyuu.id}\`\n\n> <:invitesss:1447630604958040135> **__Socials__**\n> [Instagram](https://www.instagram.com/predatororg/), [Support]()`,
      )
      .setColor("#2f3136")
      .setTimestamp();

    const diuuuEmbed = new EmbedBuilder()
      .setThumbnail(diuuu.displayAvatarURL())
      .setAuthor({
        name: "Info About Predator",
        iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }),
      })
      .setFooter({
        text: `Thanks For Using Me <3`,
        iconURL: message.author.displayAvatarURL(),
      })
      .setDescription(
        `> <:Moderation:1447587953000845382> **__Founder__**\n> - [@${diuuu.globalName || diuuu.username}](https://discord.com/users/${diuuu.id})\n> **ID:** \`${diuuu.id}\`\n\n> <:invitesss:1447630604958040135> **__Socials__**\n> [Instagram](https://www.instagram.com/predatororg/), [Support]()`,
      )
      .setColor("#2f3136")
      .setTimestamp();

    const keshuEmbed = new EmbedBuilder()
      .setThumbnail(keshu.displayAvatarURL())
      .setAuthor({
        name: "Info About Predator",
        iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }),
      })
      .setFooter({
        text: `Thanks For Using Me <3`,
        iconURL: message.author.displayAvatarURL(),
      })
      .setDescription(
        `> <:utilitye:1447587957497139241> **__Co Owner__**\n> - [@${keshu.globalName || keshu.username}](https://discord.com/users/${keshu.id})\n> **ID:** \`${keshu.id}\`\n\n> <:invitesss:1447630604958040135> **__Socials__**\n> [Instagram](https://www.instagram.com/predatororg/), [Support]()`,
      )
      .setColor("#2f3136")
      .setTimestamp();

    // Collector
    collector.on("collect", async (i) => {
      if (i.isStringSelectMenu()) {
        const choice = i.values[0];
        if (choice === "Predator")
          return i.update({ embeds: [dakshhEmbed], components: [devsMenu, backBtn] });
        if (choice === "Predator")
          return i.update({ embeds: [jiyuuEmbed], components: [devsMenu, backBtn] });
        if (choice === "Predator")
          return i.update({ embeds: [diuuuEmbed], components: [devsMenu, backBtn] });
        if (choice === "Predator")
          return i.update({ embeds: [keshuEmbed], components: [devsMenu, backBtn] });
      }
      if (i.isButton() && i.customId === "back") {
        return i.update({ embeds: [embedt], components: [devsMenu] });
      }
    });

    collector.on("end", async () => {
      try {
        await msg.edit({
          embeds: [embedt],
          components: [],
          content: `Team command timed out. Run \`${prefix}team\` again.`,
        });
      } catch {}
    });
  },
};