const Badge = require("../../models/BadgeSchema"); // Adjust path as needed
const { EmbedBuilder } = require('discord.js');

const badgeEmojiMap = {
    "Owner": "<:owner:1447584711747571753>",
    "Developer": "<:dev:1447584713689534478>",
    "Co-Developer": "<:codev:1447584716294328453>",
    "Admim": "<:admin:1447584718660042773>",
    "Supporter": "<:supportteam:1447584929939718236>",
    "Mod": "<:mod:1447584925627715634>",
    "Staff": "<:staff:1447584927393644545>",
    "Team": "<:supports:1447584720497021008>",
    "Vip": "<:vip:1447584932061904958>",
    "Friend": "<:friends:1447584934339285094>",
    "Bughunter": "<:bug:1447585150555787354>",
    "Manager": "<:communitymanager:1447585152187371522>",
    "Special": "<:special:1447585154871853128>",
    "Premuser": "<:premiumuser:1447585157111615625>",
    "User": "<:users:1447585159602901145>"
};

module.exports = {
    name: "profile",
    alises: ["pr","badges","badge"],
    description: "View user badges",
    category: "Badges",
    ownerOnly: false, // Everyone can view their own badges
    run: async (client, message, args) => {
        const member = message.mentions.users.first() || message.author;

        const userBadges = await Badge.findOne({ userId: member.id });

        const embed = new EmbedBuilder()
            .setTitle(`<:badge:1447585177995051050> **${member.tag}'s Badges** <:badge:1447585177995051050>`)
            .setColor(client.color)
            .setThumbnail(member.displayAvatarURL({ dynamic: true }));

        if (!userBadges || userBadges.badges.length === 0) {
            embed.setDescription("<:Crossmark:1447578705198055484> | This user has no badges. Consider By Joining our [Support Server](https://discord.gg/RbyBv2GsTn) To get Some of The Badges");
        } else {
            const formattedBadges = userBadges.badges.map(badge => {
                const badgeName = badge.replace(/.*・/, ''); // Extract the badge name from the stored string
                return `${badgeEmojiMap[badgeName]}・${badgeName}`;
            });
            embed.setDescription(formattedBadges.join("\n"));
        }

        return message.channel.send({ embeds: [embed] });
    }
};
