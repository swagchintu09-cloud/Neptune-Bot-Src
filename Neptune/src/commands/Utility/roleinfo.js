const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  name: "roleinfo",
  aliases: ["ri"],
  category: "Utility",
  description: "Shows detailed information about a role.",
  usage: "+roleinfo <@role | roleID>",
  run: async (client, message, args) => {
    try {
      if (!args[0]) return message.reply("<:Crossmark:1447578705198055484> Please provide a role mention or role ID.");

      const role =
        message.mentions.roles.first() ||
        message.guild.roles.cache.get(args[0]);

      if (!role) return message.reply("<:Crossmark:1447578705198055484> Role not found.");

      // Role permissions
      const permissions = role.permissions.toArray();
      const permissionList = permissions.length
        ? permissions.map(p => `\`${p}\``).join(", ")
        : "No permissions";

      // Members with this role
      const roleMembers = role.members.size;

      const embed = new EmbedBuilder()
        .setAuthor({
          name: `Role Information`,
          iconURL: message.guild.iconURL({ dynamic: true })
        })
        .setColor(role.hexColor || "#202225")
        .addFields(
          {
            name: "__General Info__",
            value: `**Role Name:** ${role.name}\n**Role ID:** \`${role.id}\`\n**Role Position:** **${role.position}**\n**Hex Code:** \`${role.hexColor}\`\n**Created At:** <t:${Math.floor(
              role.createdTimestamp / 1000
            )}:R>\n**Mentionable:** ${role.mentionable ? "<:TICK:1447578703335919778>" : "<:Crossmark:1447578705198055484>"}\n**Managed (Integration):** ${role.managed ? "<:TICK:1447578703335919778>" : "<:Crossmark:1447578705198055484>"}`,
            inline: false
          },
          {
            name: "__Allowed Permissions__",
            value: permissionList,
            inline: false
          },
          {
            name: "__Role Members__",
            value: `${roleMembers}`,
            inline: false
          }
        )
        .setFooter({
          text: `Requested by ${message.author.tag}`,
          iconURL: message.author.displayAvatarURL({ dynamic: true })
        })
        .setTimestamp();

      message.channel.send({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      message.reply("<:Crossmark:1447578705198055484> Error while fetching role info.");
    }
  }
};