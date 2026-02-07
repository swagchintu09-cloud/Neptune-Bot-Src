const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "gend",
    category: "giveaway",
    run: async (client, message, args) => {
        if (!message.member.permissions.has("ManageMessages")) {
            return message.channel.send("<:Crossmark:1447578705198055484> You need `Manage Messages` permission.");
        }

        const giveawayID = args[0];
        if (!giveawayID) return message.channel.send("<:Crossmark:1447578705198055484> Please provide the giveaway message ID!");

        const giveawayMsg = await message.channel.messages.fetch(giveawayID).catch(() => null);
        if (!giveawayMsg) return message.channel.send("<:Crossmark:1447578705198055484> Cannot find a message with that ID!");

        const reaction = giveawayMsg.reactions.cache.get("1416859590653513739");
        if (!reaction) return message.channel.send("<:Crossmark:1447578705198055484> No reactions found for this giveaway!");

        const users = await reaction.users.fetch();
        const entries = users.filter(u => !u.bot).map(u => u.id);

        if (entries.length === 0) {
            return message.channel.send("<:Crossmark:1447578705198055484> No valid entries for this giveaway!");
        }

        // Winner count (default = 1, ya embed se nikal lo agar store kiya hai)
        const winnerCount = 1;

        const shuffled = entries.sort(() => 0.5 - Math.random());
        const winners = shuffled.slice(0, winnerCount);

        // Prize from original embed
        const prize = giveawayMsg.embeds[0]?.title?.replace(/<a:Gift:\d+>|\s+/g, " ").trim() || "Prize";

        // Host detect karo (embed description me "Hosted by" likha hai)
        const hostedByMatch = giveawayMsg.embeds[0]?.description?.match(/\*\*Hosted by:\*\* (.+)/);
        const hostedBy = hostedByMatch ? hostedByMatch[1] : "Unknown";

        await giveawayMsg.edit({
            content: "**<:Panda_Gift:1447582276459429940> GIVEAWAY ENDED <:Panda_Gift:1447582276459429940>**",
            embeds: [
                new EmbedBuilder()
                    .setColor("#202225")
                    .setTitle(`<:Gift:1447583257691422843> ${prize} <:Gift:1447583257691422843>`)
                    .setDescription(
                        `<:Dot_Red:1447583261168762901> **Ended:** <t:${Math.floor(Date.now() / 1000)}:R>\n` +
                        `<:Dot_Red:1447583261168762901> **Hosted by:** ${hostedBy}\n\n` +
                        `<:Dot_Red:1447583261168762901> **Winners:** ${winners.map(w => `<@${w}>`).join(", ")}`
                    )
                    .setFooter({ text: `Ended at •` })
                    .setTimestamp()
            ]
        });

        message.channel.send(
            `Congrats ${winners.map(w => `<@${w}>`).join(", ")}! You won **${prize}**, hosted by ${hostedBy}.`
        );
    }
};