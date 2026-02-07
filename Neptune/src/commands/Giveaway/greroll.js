const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "greroll",
    category: "giveaway",
    run: async (client, message, args) => {
        if (!message.member.permissions.has("ManageMessages")) {
            return message.channel.send("<:Crossmark:1447578705198055484> You need `Manage Messages` permission.");
        }

        const giveawayID = args[0];
        if (!giveawayID) return message.channel.send("<:Crossmark:1447578705198055484> Please provide the giveaway message ID to reroll!");

        const giveawayMsg = await message.channel.messages.fetch(giveawayID).catch(() => null);
        if (!giveawayMsg) return message.channel.send("<:Crossmark:1447578705198055484> Cannot find a message with that ID!");

        const reaction = giveawayMsg.reactions.cache.get("1416859590653513739");
        if (!reaction) return message.channel.send("<:Crossmark:1447578705198055484> No reactions found for this giveaway!");

        const users = await reaction.users.fetch();
        const entries = users.filter(u => !u.bot).map(u => u.id);

        if (entries.length === 0) return message.channel.send("<:Crossmark:1447578705198055484> No valid entries to reroll!");

        // Winner count (default = 1, ya embed se nikal sakte ho future me)
        const winnerCount = 1;

        const shuffled = entries.sort(() => 0.5 - Math.random());
        const winners = shuffled.slice(0, winnerCount);

        // Prize cleanup
        const prize = giveawayMsg.embeds[0]?.title?.replace(/<a:Gift:\d+>|\s+/g, " ").trim() || "Prize";

        // Host detect (embed description ke andar "Hosted by" hai)
        const hostedByMatch = giveawayMsg.embeds[0]?.description?.match(/\*\*Hosted by:\*\* (.+)/);
        const hostedBy = hostedByMatch ? hostedByMatch[1] : "Unknown";

        await giveawayMsg.edit({
            content: "**<:Panda_Gift:1447582276459429940> GIVEAWAY REROLLED <:Panda_Gift:1447582276459429940>**",
            embeds: [
                new EmbedBuilder()
                    .setColor("#202225")
                    .setTitle(`<:Gift:1447583257691422843> ${prize} <:Gift:1447583257691422843>`)
                    .setDescription(
                        `<:Dot_Red:1447583261168762901> **Rerolled at:** <t:${Math.floor(Date.now() / 1000)}:R>\n` +
                        `<:Dot_Red:1447583261168762901> **Hosted by:** ${hostedBy}\n\n` +
                        `<:Dot_Red:1447583261168762901> **New Winners:** ${winners.map(w => `<@${w}>`).join(", ")}`
                    )
                    .setFooter({ text: `Rerolled at •` })
                    .setTimestamp()
            ]
        });

        message.channel.send(
            `Congrats ${winners.map(w => `<@${w}>`).join(", ")}! You won **${prize}** in the reroll, hosted by ${hostedBy}.`
        );
    }
};