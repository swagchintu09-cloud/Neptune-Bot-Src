const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "ship",
  description: "Ship yourself or mentioned users",
  run: async (client, message, args) => {
    let user1, user2;

    if (message.mentions.users.size === 0) {
      // Agar mention nahi hai → author + random member
      const members = message.guild.members.cache.filter(m => !m.user.bot && m.id !== message.author.id).map(m => m.user);
      if (members.length < 1) return message.channel.send("<:Crossmark:1447578705198055484> Not enough members to ship!");
      user1 = message.author;
      user2 = members[Math.floor(Math.random() * members.length)];
    } 
    else if (message.mentions.users.size === 1) {
      // Agar ek mention hai → author + user
      user1 = message.author;
      user2 = message.mentions.users.first();
    } 
    else {
      // Agar do mention hai → dono ko ship kare
      user1 = message.mentions.users.at(0);
      user2 = message.mentions.users.at(1);
    }

    // Random love percentage
    const lovePercent = Math.floor(Math.random() * 101);

    // Ship name (half + half)
    const shipName = user1.username.slice(0, Math.floor(user1.username.length / 2)) +
                     user2.username.slice(Math.floor(user2.username.length / 2));

    // Emoji based on lovePercent
    let emoji = "💔";
    if (lovePercent > 70) emoji = "💖";
    else if (lovePercent > 40) emoji = "❤️";
    else if (lovePercent > 20) emoji = "💞";

    // Special messages
    let special = "";
    if (lovePercent === 100) special = "Perfect Soulmates! A wedding is coming soon!";
    else if (lovePercent >= 90) special = "True love is in the air!";
    else if (lovePercent >= 70) special = "A beautiful bond, made in heaven!";
    else if (lovePercent >= 50) special = "You both look cute together!";
    else if (lovePercent >= 30) special = "There’s a chance… give it some time!";
    else if (lovePercent >= 10) special = "Maybe just friends for now!";
    else special = "Better luck next time, this ship sank!";

    const embed = new EmbedBuilder()
      .setTitle("Shipping Time!")
      .setDescription(`**${user1.username}** + **${user2.username}** = **${shipName}**\n\nCompatibility: **${lovePercent}%** ${emoji}\n\n${special}`)
      .setColor("#202225")
      .setThumbnail(user1.displayAvatarURL({ dynamic: true }))
      .setImage(user2.displayAvatarURL({ dynamic: true }));

    message.channel.send({ embeds: [embed] });
  }
};