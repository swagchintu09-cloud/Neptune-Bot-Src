const { EmbedBuilder } = require("discord.js");

module.exports = {

  name: "boostcount",

  aliases: ["bc"],

  category: "Utility",

  description: "Shows the server boost information",

  async execute(message, args, client) {

    try {

      const guild = message.guild;

      const embed = new EmbedBuilder()

        .setTitle("Boost Information")

        .setColor("#202225") // default embed colour

        .setDescription(

          `<:dot:1447645653520879809> **Boost Count:** ${guild.premiumSubscriptionCount}\n` +
            `\u200B\n` +

          `<:dot:1447645653520879809> **Boost Level:** ${guild.premiumTier}`

        )

        .setFooter({

          text: `Requested By ${message.author.tag}`,

          iconURL: message.author.displayAvatarURL({ dynamic: true })

        });

      await message.channel.send({ embeds: [embed] });

    } catch (err) {

      console.error(err);

      message.reply("❌ Something went wrong while fetching boost info!");

    }

  },

};