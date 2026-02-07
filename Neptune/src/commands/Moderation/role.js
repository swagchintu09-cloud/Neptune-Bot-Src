const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "role",
  description: "Add or remove a role from a user.",
  category: "Moderation",
  usage: "<add/remove> <@user> <@role>",

  run: async (client, message, args) => {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
      return message.reply({
        embeds: [new EmbedBuilder().setColor("#202225").setDescription("<:Crossmark:1447578705198055484> | You don’t have permission!")],
      });
    }

    const action = args[0];
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
    const role =
      message.mentions.roles.first() ||
      message.guild.roles.cache.get(args[2]) ||
      message.guild.roles.cache.find(r => r.name.toLowerCase() === args.slice(2).join(" ").toLowerCase());

    if (!action || !["add", "remove"].includes(action.toLowerCase())) {
      return message.reply({
        embeds: [new EmbedBuilder().setColor("#202225").setDescription("<:Crossmark:1447578705198055484> | Use: `role <add/remove> <@user> <@role>`")],
      });
    }

    if (!member) {
      return message.reply({
        embeds: [new EmbedBuilder().setColor("#202225").setDescription("<:Crossmark:1447578705198055484> | Please mention a user!")],
      });
    }

    if (!role) {
      return message.reply({
        embeds: [new EmbedBuilder().setColor("#202225").setDescription("<:Crossmark:1447578705198055484> | Role not found!")],
      });
    }

    try {
      if (action.toLowerCase() === "add") {
        await member.roles.add(role);
        return message.reply({
          embeds: [new EmbedBuilder().setColor("#202225").setDescription(`<:TICK:1447578703335919778> | Added role ${role} to ${member}.`)],
        });
      } else {
        await member.roles.remove(role);
        return message.reply({
          embeds: [new EmbedBuilder().setColor("#202225").setDescription(`<:TICK:1447578703335919778> | Removed role ${role} from ${member}.`)],
        });
      }
    } catch (err) {
      console.error(err);
      return message.reply({
        embeds: [new EmbedBuilder().setColor("#202225").setDescription("<:Crossmark:1447578705198055484> | Failed to modify role.")],
      });
    }
  },
};