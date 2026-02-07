const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  name: "purge",
  category: "Moderation",
  aliases: ["clear", "purne"],
  cooldown: 3,
  description: "Delete messages in bulk.",
  args: true,
  usage: "<number_of_messages>",
  userPerms: ["ManageMessages"],
  owner: false,

  execute: async (message, args, client, prefix) => {
    try {
      // ---------- SAFETY CHECKS ----------
      if (!message.guild || !message.member || !message.channel) return;

      if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.color)
              .setDescription(`${client.emoji.cross} | You must have \`Manage Messages\` permissions to use this command.`),
          ],
        });
      }

      // ---------- PARSE AMOUNT ----------
      const amount = parseInt(args[0]);
      if (!amount || isNaN(amount)) {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.color)
              .setDescription(`${client.emoji.cross} | You must provide a valid number of messages to delete.`),
          ],
        });
      }

      if (amount < 1 || amount > 100) {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.color)
              .setDescription(`${client.emoji.cross} | You can delete between 1 and 100 messages at a time.`),
          ],
        });
      }

      // ---------- DELETE MESSAGES ----------
      await message.delete().catch(() => {}); // Delete command message first

      const deleted = await message.channel.bulkDelete(amount, true).catch((err) => {
        console.error(err);
        throw new Error("Unable to bulk delete messages. Messages may be older than 14 days.");
      });

      // ---------- CONFIRMATION ----------
      if (!message.channel) return;
      const confirm = await message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`${client.emoji.tick} | Successfully deleted **${deleted.size}** messages.`),
        ],
      });

      setTimeout(() => confirm.delete().catch(() => {}), 1000);

    } catch (error) {
      console.error(error);
      if (!message.channel) return;
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`${client.emoji.cross} | An error occurred while trying to delete messages.`),
        ],
      });
    }
  },
};