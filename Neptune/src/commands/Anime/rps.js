const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  name: "rps",
  description: "Rock Paper Scissors Fun Mode ✊📄✂️",
  run: async (client, message, args) => {
    const choices = ["rock", "paper", "scissors"];
    const emojiMap = { rock: "✊", paper: "📄", scissors: "✂️" };
    const funMessages = {
      win: ["GG 🎉 You crushed it!", "Nice one", "Winner winner chicken dinner"],
      lose: ["Lmao, Better luck next time!", "Oof, You lost!", "Try again"],
      draw: ["It's a tie, Close one!", "Draw!", "Evenly matched"]
    };

    const opponent = message.mentions.users.first();
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("rock").setLabel("✊ Rock").setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId("paper").setLabel("📄 Paper").setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId("scissors").setLabel("✂️ Scissors").setStyle(ButtonStyle.Danger)
    );

    if (!opponent) {
      // Bot vs User
      const embed = new EmbedBuilder()
        .setTitle("Rock Paper Scissors - Bot Mode")
        .setDescription("Click a button to choose your move against the bot!")
        .setColor("#202225");

      const msg = await message.channel.send({ embeds: [embed], components: [row] });

      const filter = (i) => i.user.id === message.author.id;
      const collector = msg.createMessageComponentCollector({ filter, time: 15000, max: 1 });

      collector.on("collect", async (i) => {
        const userChoice = i.customId;
        const botChoice = choices[Math.floor(Math.random() * choices.length)];

        let resultText;
        if (userChoice === botChoice) resultText = funMessages.draw[Math.floor(Math.random() * funMessages.draw.length)];
        else if (
          (userChoice === "rock" && botChoice === "scissors") ||
          (userChoice === "paper" && botChoice === "rock") ||
          (userChoice === "scissors" && botChoice === "paper")
        ) resultText = funMessages.win[Math.floor(Math.random() * funMessages.win.length)];
        else resultText = funMessages.lose[Math.floor(Math.random() * funMessages.lose.length)];

        const resultEmbed = new EmbedBuilder()
          .setTitle("Rock Paper Scissors - Result")
          .setDescription(`${message.author} ${emojiMap[userChoice]} vs Bot ${emojiMap[botChoice]}\n\n${resultText}`)
          .setColor("#202225");

        await i.update({ embeds: [resultEmbed], components: [] });
      });

      collector.on("end", (collected) => {
        if (collected.size === 0) {
          msg.edit({ content: "<:warn:1447578710155985041> You didn’t choose in time!", components: [] });
        }
      });

    } else {
      // 1v1 Mode
      if (opponent.bot) return message.reply("You can’t challenge a bot in 1v1 mode!");
      if (opponent.id === message.author.id) return message.reply("You can’t play against yourself!");

      const embed = new EmbedBuilder()
        .setTitle("Rock Paper Scissors 1v1")
        .setDescription(`${message.author} challenged ${opponent}!\n\nBoth players, click a button to choose your move.`)
        .setColor("#202225");

      const msg = await message.channel.send({ embeds: [embed], components: [row] });
      const players = new Map();
      const filter = (i) => i.user.id === message.author.id || i.user.id === opponent.id;
      const collector = msg.createMessageComponentCollector({ filter, time: 20000 });

      collector.on("collect", async (i) => {
        if (players.has(i.user.id)) return i.reply({ content: "<:warn:1447578710155985041> You already chose!", ephemeral: true });
        players.set(i.user.id, i.customId);
        await i.reply({ content: `<:TICK:1447578703335919778> You chose ${emojiMap[i.customId]}`, ephemeral: true });
        if (players.size === 2) collector.stop("finished");
      });

      collector.on("end", async (_, reason) => {
        if (players.size < 2) {
          return msg.edit({ content: "<:warn:1447578710155985041> Game cancelled! One or both players didn’t choose in time.", components: [] });
        }

        const userChoice = players.get(message.author.id);
        const opponentChoice = players.get(opponent.id);

        let resultText;
        if (userChoice === opponentChoice) resultText = funMessages.draw[Math.floor(Math.random() * funMessages.draw.length)];
        else if (
          (userChoice === "rock" && opponentChoice === "scissors") ||
          (userChoice === "paper" && opponentChoice === "rock") ||
          (userChoice === "scissors" && opponentChoice === "paper")
        ) resultText = `${message.author} ${funMessages.win[Math.floor(Math.random() * funMessages.win.length)]}`;
        else resultText = `${opponent} ${funMessages.lose[Math.floor(Math.random() * funMessages.lose.length)]}`;

        const resultEmbed = new EmbedBuilder()
          .setTitle("Rock Paper Scissors - Result")
          .setDescription(`${message.author} ${emojiMap[userChoice]} vs ${opponent} ${emojiMap[opponentChoice]}\n\n${resultText}`)
          .setColor("#202225");

        msg.edit({ embeds: [resultEmbed], components: [] });
      });
    }
  }
};