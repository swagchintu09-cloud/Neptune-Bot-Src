const {
  ChannelType,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  PermissionsBitField,
} = require("discord.js");
const wait = require("wait");
const reconnect = require("../models/reconnect.js");
const VoiceSchema = require("../models/VoiceSchema.js"); // <-- add this

module.exports = async (client) => {
  client.on("voiceStateUpdate", async (oldState, newState) => {
    if (!newState || !newState.guild) return;

    try {
      // ----------- VOICE COUNT LOGIC -----------
      if (!client.voiceJoinTimes) client.voiceJoinTimes = new Map();

      const guildId = newState.guild.id;
      const userId = newState.id;

      // User joins VC
      if (!oldState.channel && newState.channel) {
        client.voiceJoinTimes.set(`${guildId}_${userId}`, Date.now());
      }

      // User leaves VC
      if (oldState.channel && !newState.channel) {
        const joinTime = client.voiceJoinTimes.get(`${guildId}_${userId}`);
        if (joinTime) {
          const seconds = Math.floor((Date.now() - joinTime) / 1000);

          let data = await VoiceSchema.findOne({ guildId, userId });
          if (!data) {
            data = new VoiceSchema({
              guildId,
              userId,
              allTime: 0,
              daily: 0,
              weekly: 0,
            });
          }

          data.allTime += seconds;
          data.daily += seconds;
          data.weekly += seconds;
          await data.save();

          client.voiceJoinTimes.delete(`${guildId}_${userId}`);
        }
      }

      // User switches VC channels
      if (
        oldState.channel &&
        newState.channel &&
        oldState.channelId !== newState.channelId
      ) {
        const joinTime = client.voiceJoinTimes.get(`${guildId}_${userId}`);
        if (joinTime) {
          const seconds = Math.floor((Date.now() - joinTime) / 1000);

          let data = await VoiceSchema.findOne({ guildId, userId });
          if (!data) {
            data = new VoiceSchema({
              guildId,
              userId,
              allTime: 0,
              daily: 0,
              weekly: 0,
            });
          }

          data.allTime += seconds;
          data.daily += seconds;
          data.weekly += seconds;
          await data.save();
        }

        client.voiceJoinTimes.set(`${guildId}_${userId}`, Date.now());
      }

      // ----------- EXISTING MUSIC BOT LOGIC -----------
      let player = client.manager.players.get(newState.guild.id);
      const reconnectAuto = await reconnect.findOne({
        GuildId: newState.guild.id,
      });
      if (!player) return;
      if (oldState.id === client.user.id) return;
      if (
        !newState.guild.members.cache.get(client.user.id).voice.channelId ||
        !oldState.guild.members.cache.get(client.user.id).voice.channelId
      )
        return;
      if (!newState.guild.members.me.voice.channel) {
        player.destroy();
      }
      if (newState.id === client.user.id && newState.serverMute)
        newState.setMute(false);

      await wait(180000);

      if (reconnectAuto) {
        if (player) {
          const channelID = player.node.manager.connections.get(
            newState.guild.id
          );
          if (!channelID?.channelId) return;
          const playerVoiceChannel = newState.guild.channels.cache.get(
            channelID.channelId
          );
          if (
            playerVoiceChannel &&
            playerVoiceChannel.members.filter((x) => !x.user.bot).size <= 0
          ) {
            await wait(1000);
            player.setLoop("none");
            await wait(1000);
            player.data.set("autoplay", false);
            await wait(1000);
            player.queue.clear();
            await wait(1000);
            player.skip();
          }
        }
      } else {
        if (player) {
          const channelID = player.node.manager.connections.get(
            newState.guild.id
          );
          if (!channelID?.channelId) return;
          const playerVoiceChannel = newState.guild.channels.cache.get(
            channelID.channelId
          );
          if (
            playerVoiceChannel &&
            playerVoiceChannel.members.filter((x) => !x.user.bot).size <= 0
          ) {
            // agar autoplay ya 24/7 ON hai to kuch mat karo
            if (player.data.get("autoplay") || player.data.get("twentyfourseven")) return;

            // warna bot leave karega aur message bhejega
            player.destroy();

            let channel = client.channels.cache.get(player.textId);
            if (channel) {
              const embed = new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({
                  name: `${client.user.username} Alert!`,
                  iconURL: client.user.displayAvatarURL(),
                })
                .setDescription(
                  `**I Left The Voice Channel.** Because No One Was Listening Music With me.`
                );
              await channel.send({ embeds: [embed] });
            }
          }
        }
      }
    } catch (err) {
      console.error("VoiceStateUpdate Error:", err);
    }
  });
};