// events/messageDelete.js
const snipes = new Map();

module.exports = (client) => {
  client.on("messageDelete", (message) => {
    if (message.partial || !message.content) return;
    snipes.set(message.channel.id, {
      content: message.content,
      author: message.author,
      time: new Date(),
    });
  });

  client.snipes = snipes;
};