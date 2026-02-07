const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "glist",
    category: "giveaway",
    run: async (client, message) => {
        if (!client.giveaways || client.giveaways.size === 0) {
            return message.channel.send("🎁 No active giveaways running.");
        }

        const active = [...client.giveaways.values()].filter(g => !g.ended);
        if (active.length === 0) {
            return message.channel.send("🎁 No active giveaways running.");
        }

        const embed = new EmbedBuilder()
            .setColor("#202225")
            .setTitle("🎁 Active Giveaways")
            .setDescription(
                active.map(g =>
                    `**${g.prize}**\n` +
                    `Hosted by: <@${g.hostId}>\n` +
                    `Ends: <t:${Math.floor(g.endTime / 1000)}:R>\n` +
                    `Link: [Jump](https://discord.com/channels/${g.guildId}/${g.channelId}/${g.messageId})`
                ).join("\n\n")
            )
            .setFooter({ text: `Total: ${active.length} giveaways` });

        message.channel.send({ embeds: [embed] });
    }
};