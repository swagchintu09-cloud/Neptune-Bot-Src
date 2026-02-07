const { EmbedBuilder } = require("discord.js");
const ms = require("ms");

module.exports = {
    name: "gstart",
    aliases: ["gcreate"],
    category: "giveaway",
    run: async (client, message, args) => {
        if (!message.member.permissions.has("ManageMessages")) {
            return message.channel.send("<:Crossmark:1447578705198055484> You need `Manage Messages` permission.");
        }

        if (args.length < 3) {
            return message.channel.send("Usage: `gstart <duration> <winners> <prize>`");
        }

        const duration = args[0];
        const winnerCount = parseInt(args[1]);
        const prize = args.slice(2).join(" ");
        const time = ms(duration);

        if (!time) return message.channel.send("<:Crossmark:1447578705198055484> Invalid duration!");
        if (!winnerCount || winnerCount < 1) return message.channel.send("<:Crossmark:1447578705198055484> Invalid winner count!");

        const endTime = Date.now() + time;

        const embed = new EmbedBuilder()
            .setColor("#202225")
            .setTitle(`<:Gift:1447583257691422843> ${prize} <:Gift:1447583257691422843>`)
            .setDescription(
                `<:Dot_Red:1447583261168762901> **Ends:** <t:${Math.floor(endTime / 1000)}:R> (<t:${Math.floor(endTime / 1000)}:f>)\n` +
                `<:Dot_Red:1447583261168762901> **Hosted by:** ${message.author}\n` +
                `<:Dot_Red:1447583261168762901> **Winners:** ${winnerCount}\n\n` +
                `<:Dot_Red:1447583261168762901> React with <:Gift:1447583257691422843> to participate!`
            )
            .setFooter({ text: `Ends at • ` })
            .setTimestamp(endTime);

        const giveawayMessage = await message.channel.send({
            content: "**<:Panda_Gift:1447582276459429940> GIVEAWAY STARTED <:Panda_Gift:1447582276459429940>**",
            embeds: [embed]
        });

        message.delete().catch(() => null);

        await giveawayMessage.react("1417572577886339144");

        setTimeout(async () => {
            const msg = await message.channel.messages.fetch(giveawayMessage.id).catch(() => null);
            if (!msg) return;

            const reaction = msg.reactions.cache.get("1417572577886339144");
            if (!reaction) {
                return message.channel.send("<:Crossmark:1447578705198055484> No valid entries, giveaway cancelled.");
            }

            const users = await reaction.users.fetch();
            const entries = users.filter(u => !u.bot).map(u => u.id);

            if (entries.length === 0) {
                await msg.edit({
                    content: "**<:Panda_Gift:1447582276459429940> GIVEAWAY ENDED <:Panda_Gift:1447582276459429940>**",
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#202225")
                            .setTitle(`<:Gift:1447583257691422843> ${prize} <:Gift:1447583257691422843>`)
                            .setDescription(
                                `<:Dot_Red:1447583261168762901> **Ended:** <t:${Math.floor(Date.now() / 1000)}:R>\n` +
                                `<:Dot_Red:1447583261168762901> **Hosted by:** ${message.author}\n\n` +
                                `<:Dot_Red:1447583261168762901> **Winners:** No valid entries`
                            )
                            .setFooter({ text: `Ended at • ` })
                            .setTimestamp()
                    ]
                });

                return msg.channel.send("<:Crossmark:1447578705198055484> No valid entries, giveaway cancelled.");
            }

            const shuffled = entries.sort(() => 0.5 - Math.random());
            const winners = shuffled.slice(0, winnerCount);

            await msg.edit({
                content: "**<:Panda_Gift:1447582276459429940> GIVEAWAY ENDED <:Panda_Gift:1447582276459429940>**",
                embeds: [
                    new EmbedBuilder()
                        .setColor("#202225")
                        .setTitle(`<:Gift:1447583257691422843> ${prize} <:Gift:1447583257691422843>`)
                        .setDescription(
                            `<:Dot_Red:1447583261168762901> **Ended:** <t:${Math.floor(Date.now() / 1000)}:R>\n` +
                            `<:Dot_Red:1447583261168762901> **Hosted by:** ${message.author}\n\n` +
                            `<:Dot_Red:1447583261168762901> **Winners:** ${winners.map(w => `<@${w}>`).join(", ")}`
                        )
                        .setFooter({ text: `Ended at • ` })
                        .setTimestamp()
                ]
            });

            msg.channel.send(
                `Congrats ${winners.map(w => `<@${w}>`).join(", ")}! You have won **${prize}**, hosted by ${message.author}!`
            );
        }, time);
    }
};