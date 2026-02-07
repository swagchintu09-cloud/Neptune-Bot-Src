const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "roleicon",
  description: "Set an icon for a role.",
  category: "Moderation",
  usage: "<@role> <emoji/image_url>",

  run: async (client, message, args) => {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
      return message.reply({ embeds: [new EmbedBuilder().setColor("#202225").setDescription("<:Crossmark:1447578705198055484> | You don’t have permission!")] });
    }

    const roleId = message.mentions.roles.first()?.id || args[0];
    let role;

    try {
      role = await message.guild.roles.fetch(roleId);
    } catch (e) {
      role = null;
    }

    if (!role) {
      return message.reply({ embeds: [new EmbedBuilder().setColor("#202225").setDescription("<:Crossmark:1447578705198055484> | Role not found!")] });
    }

    let icon = args[1];
    if (!icon) {
      return message.reply({ embeds: [new EmbedBuilder().setColor("#202225").setDescription("<:Crossmark:1447578705198055484> | Please provide an emoji or image URL!")] });
    }

    // agar custom emoji diya ho to uska CDN URL banao
    const emojiRegex = /<a?:\w+:(\d+)>/;
    const match = icon.match(emojiRegex);
    if (match) {
      const emojiId = match[1];
      icon = `https://cdn.discordapp.com/emojis/${emojiId}.png`;
    }

    try {
      await role.setIcon(icon);
      return message.reply({ embeds: [new EmbedBuilder().setColor("#202225").setDescription(`<:TICK:1447578703335919778> | Role icon updated for **${role.name}**`)] });
    } catch (err) {
      console.error(err);
      return message.reply({ embeds: [new EmbedBuilder().setColor("#202225").setDescription("<:Crossmark:1447578705198055484> | Failed to set role icon. Make sure my role is higher and I have Manage Roles permission.")] });
    }
  },
};