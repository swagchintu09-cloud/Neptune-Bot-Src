const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const RoleConfig = require("../../models/roleSchema.js");

module.exports = {
  name: "rolesetup",
  aliases: ["rs"],
  description: "Manage custom role setup",
  usage: "rs <subcommand>",
  category: "Custom Roles",

  run: async (client, message, args) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#202225")
            .setDescription("<:Crossmark:1447578705198055484> You need the **Manage Roles** permission to use this command.")
        ]
      });
    }

    const sub = args[0]?.toLowerCase();

    // Common embed
    const embed = new EmbedBuilder()
      .setColor("#202225")
      .setFooter({ text: message.guild.name })
      .setTimestamp();

    // If no subcommand
    if (!sub) {
      return message.channel.send({
        embeds: [
          embed
            .setTitle("<:Crossmark:1447578705198055484> Please provide a valid subcommand")
            .setDescription("Available options:\n`reqrole`, `official`, `friend`, `guest`, `girl`, `vip`, `add`, `remove`, `list`, `config`, `reset`")
        ],
      });
    }

    // Fetch or create DB entry
    let data = await RoleConfig.findOne({ guildId: message.guild.id });
    if (!data) data = await RoleConfig.create({ guildId: message.guild.id });

    // =====================
    // FIXED ROLES
    // =====================
    const fixedRoles = ["reqrole", "official", "friend", "guest", "girl", "vip"];
    if (fixedRoles.includes(sub)) {
      const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
      if (!role) {
        return message.channel.send({
          embeds: [embed.setDescription("<:Crossmark:1447578705198055484> Please mention a valid role.")],
        });
      }

      data[sub] = role.id;
      await data.save();

      return message.channel.send({
        embeds: [embed.setDescription(`<:TICK:1447578703335919778> ${sub} role set to ${role}`)],
      });
    }

    // =====================
    // DYNAMIC ROLES
    // =====================
    if (sub === "add") {
      const name = args[1]?.toLowerCase();
      const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2]);
      if (!name || !role) {
        return message.channel.send({
          embeds: [embed.setDescription("<:Crossmark:1447578705198055484> Usage: `rs add <name> @Role`")],
        });
      }

      if (data.names.includes(name)) {
        return message.channel.send({
          embeds: [embed.setDescription("<:Crossmark:1447578705198055484> That custom role name is already in use.")],
        });
      }

      data.names.push(name);
      data.roles.push(role.id);
      await data.save();

      return message.channel.send({
        embeds: [embed.setDescription(`<:TICK:1447578703335919778> Custom role \`${name}\` set to ${role}`)],
      });
    }

    if (sub === "remove") {
      const name = args[1]?.toLowerCase();
      if (!name) {
        return message.channel.send({
          embeds: [embed.setDescription("<:Crossmark:1447578705198055484> Usage: `rs remove <name>`")],
        });
      }

      const index = data.names.indexOf(name);
      if (index === -1) {
        return message.channel.send({
          embeds: [embed.setDescription("<:Crossmark:1447578705198055484> That custom role does not exist.")],
        });
      }

      const removedRole = data.roles[index];

      data.names.splice(index, 1);
      data.roles.splice(index, 1);
      await data.save();

      return message.channel.send({
        embeds: [embed.setDescription(`<:TICK:1447578703335919778> Removed custom role \`${name}\` (<@&${removedRole}>)`)],
      });
    }

    if (sub === "list") {
      if (!data.names.length) {
        return message.channel.send({
          embeds: [embed.setDescription("<:Crossmark:1447578705198055484> No custom roles found.")],
        });
      }

      const list = data.names
        .map((n, i) => `\`${n}\` → <@&${data.roles[i]}>`)
        .join("\n");

      return message.channel.send({
        embeds: [embed.setTitle("<:support:1447580381309177988> __Custom Roles__").setDescription(list)],
      });
    }

    // =====================
    // CONFIG (Fixed + Dynamic both)
    // =====================
    if (sub === "config") {
      let fixed = fixedRoles
        .map(r => `${r}: ${data[r] ? `<@&${data[r]}>` : "`Not set`"}`)
        .join("\n");

      let dynamic = data.names.length
        ? data.names.map((n, i) => `\`${n}\` → <@&${data.roles[i]}>`).join("\n")
        : "`No custom roles`";

      return message.channel.send({
        embeds: [
          embed.setTitle("<:support:1447580381309177988> __Role Configuration__")
            .addFields(
              { name: "Fixed Roles", value: fixed, inline: false },
              { name: "Dynamic Roles", value: dynamic, inline: false }
            )
        ],
      });
    }

    // =====================
    // RESET
    // =====================
    if (sub === "reset") {
      data.names = [];
      data.roles = [];
      fixedRoles.forEach(r => (data[r] = null));
      await data.save();

      return message.channel.send({
        embeds: [embed.setDescription("<:TICK:1447578703335919778> All role configurations have been reset.")],
      });
    }

    // Invalid subcommand
    return message.channel.send({
      embeds: [
        embed
          .setTitle("<:Crossmark:1447578705198055484> Invalid Subcommand")
          .setDescription("Available options:\n`reqrole`, `official`, `friend`, `guest`, `girl`, `vip`, `add`, `remove`, `list`, `config`, `reset`")
      ],
    });
  },
};