const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  AttachmentBuilder,
} = require("discord.js");
const setplayer = require("../models/SetupPlayerSchema.js");
const setup = require("../models/SetupSchema.js");
const updateMessage = require("../handlers/setupQueue.js");
const { ClassicPro } = require('musicard');
const fs = require("fs");

module.exports = async (client) => {
  client.manager.on("playerStart", async (player, track) => {
    try {
      const playerConfig = await setplayer.findOne({ guildId: player.guildId });
      const mode = playerConfig?.playerMode || 'classic';

      const updateData = await setup.findOne({ guildId: player.guildId });
    

    await updateMessage(player, client, track);
    if (updateData) {
      if (updateData.channelId == player.textId) return;
    }
  
      player.previousTrack = player.currentTrack || null;
      player.currentTrack = track;
  
      const embeded = createEmbed(track, client);
      if (mode === "musicard") {
        // Generate the Musicard image and send it
        ClassicPro({
          thumbnailImage: track.thumbnail.dynamic ? track.thumbnail.dynamic() : track.thumbnail,
        backgroundColor: '#070707',
        progress: 10,
        progressColor: '#FF0000',
        progressBarColor: '#5F2D00',
        name: track.title,
        nameColor: '#FF0000',
        author: track.author,
        authorColor: '#696969',
        startTime: '0:00',
        endTime: `${convertMilliseconds(track.length)}`,
        timeColor: '#FF4D4D',
        }).then((imageBuffer) => {
          // Save the generated image and send it
          const filePath = `./musicard-${player.guildId}.png`;
          fs.writeFileSync(filePath, imageBuffer);
          const attachment = new AttachmentBuilder(filePath);
          client.channels.cache
            .get(player.textId)
            .send({ files: [attachment] });
        });
      } else {
        // For other modes, continue with sending the embed and buttons
        const componentRows = setupPlayerButtons(player, track, mode);
        const nplaying = await client.channels.cache
          .get(player.textId)
          .send({ embeds: [embeded], components: componentRows });
  
      const filter = (interaction) => {
        return (
          interaction.guild.members.me.voice.channel &&
          interaction.guild.members.me.voice.channelId === interaction.member.voice.channelId
        );
      };

      const collector = nplaying.createMessageComponentCollector({
        filter,
        time: player.queue.current.length,
      });
  
      collector.on("collect", async (interaction) => {
        await handleInteraction(interaction, player, client, track, nplaying, embeded, mode);
      });

      
      collector.on("end", async (collected, reason) => {
      if (reason === "time") {
        nplaying.edit({ embeds: [embeded], components: [] });
      }
    });
    }
    } catch (error) {
      console.error(`Error in playerStart for guild ${player.guildId}:`, error);
    }
  

function createEmbed(track, client) {
  return new EmbedBuilder()
    .setAuthor({
      name: "| Now Playing",
      iconURL: client.user.displayAvatarURL(),
    })
    .setDescription(
      `${client.emoji.playing} **[${
        track.title.length > 50
          ? track.title.slice(0, 50) + "... "
          : track.title || "Unknown Track"
      }](${client.config.ssLink})**`
    )
    .addFields(
      { name: `${client.emoji.author} Author:`, value: `${track.author || "Unknown"}`, inline: true },
      { name: `${client.emoji.requester} Requester:`, value: `${track.requester || "**Neptune**"}`, inline: true },
      { name: `${client.emoji.duration} Duration:`, value: `${convertMilliseconds(track.length)}`, inline: true }
    )
    .setThumbnail(track.thumbnail)
    .setColor(client.color)
    .setTimestamp();
}

function setupPlayerButtons(player, track, mode) {
  const rows = [];
  
  switch (mode) {
    case "classic":
      const classicRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("pause")
          .setLabel(player.paused ? "Resume" : "Pause")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("skip")
          .setLabel("Skip")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("shuffle")
          .setLabel("Shuffle")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("replay")
          .setLabel("Replay")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("stop")
          .setLabel("Stop")
          .setStyle(ButtonStyle.Danger)
      );
      rows.push(classicRow);
      break;

      case "musicard":
        break;

    case "spotify":
      const spotifyRow1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("previous")
          .setEmoji("<:previous:1447654447386722386>")
          .setStyle(ButtonStyle.Success)
          .setDisabled(!player.previousTrack),
        new ButtonBuilder()
          .setCustomId("pause")
          .setEmoji(player.paused ? "<:resume:1447654449567764603>" : "<:pause:1447654451698597928>")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("skip")
          .setEmoji("<:skip:1447654453791686820>")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("stop")
          .setEmoji("<:stop:1447654455955685426>")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("replay")
          .setEmoji("<:replayy:1447654655395102772>")
          .setStyle(ButtonStyle.Success)
      );
      const spotifyRow2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("volumeUp")
          .setEmoji("<:volup:1447654657764888606>")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("volumeDown")
          .setEmoji("<:voldown:1447654659924689108>")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("loop")
          .setEmoji("<:loopop:1447654661661397097>")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("shuffle")
          .setEmoji("<:shuffle:1447654664387690720>")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("save")
          .setEmoji("<:save:1447655116348981409>")
          .setStyle(ButtonStyle.Success)
      );
      rows.push(spotifyRow1, spotifyRow2);
      break;

    case "simple":
      const simpleRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("pause")
          .setLabel(player.paused ? "Resume" : "Pause")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("skip")
          .setLabel("Skip")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("shuffle")
          .setLabel("Shuffle")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("replay")
          .setLabel("Replay")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("stop")
          .setLabel("Stop")
          .setStyle(ButtonStyle.Secondary)
      );
      const filterRow = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("filterSelect")
          .setPlaceholder("Select a filter...")
          .addOptions([
            { label: "Bass Boost", description: "Apply Bassboost Filter To Current Playing", emoji: "<:filters:1447655125576454318>", value: "bassboost" },
            { label: "Nightcore", description: "Apply Nightcore Filter To Current Playing", emoji: "<:filters:1447655125576454318>", value: "nightcore" },
            { label: "Vaporwave", description: "Apply Vaporwave Filter To Current Playing", emoji: "<:filters:1447655125576454318>", value: "vaporwave" },
            { label: "Tremolo", description: "Apply Tremolo Filter To Current Playing", emoji: "<:filters:1447655125576454318>", value: "tremolo" },
            { label: "Vibrato", description: "Apply Vibrato Filter To Current Playing", emoji: "<:filters:1447655125576454318>", value: "vibrato" },
            { label: "Karaoke", description: "Apply Karaoke Filter To Current Playing", emoji: "<:filters:1447655125576454318>", value: "karaoke" },
            { label: "Distortion", description: "Apply Distortion Filter To Current Playing", emoji: "<:filters:1447655125576454318>", value: "distortion" },
            { label: "None", description: "Reset All Filters From Current Playing", emoji: "<:replayy:1447654655395102772>", value: "none" },
          ])
      );
      rows.push(filterRow, simpleRow);
      break;

    case "special":
      const specialrow1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("previous")
          .setEmoji("<:emoji_24:1447655127279337655>")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(!player.previousTrack),
        new ButtonBuilder()
          .setCustomId("pause")
          .setEmoji(player.paused ? "<:emoji_30:1447655130244583585>" : "<:emoji_25:1447655132954230948>")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("skip")
          .setEmoji("<:emoji_25:1447655640548769913>")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("stop")
          .setEmoji("<:emoji_28:1447655642742526108>")
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId("replay")
          .setEmoji("<:emoji_36:1447655643992424498>")
          .setStyle(ButtonStyle.Secondary)
      );
      const specialrow2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("volumeUp")
          .setEmoji("<:emoji_26:1447655645099724905>")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("volumeDown")
          .setEmoji("<:emoji_27:1447655646844551218>")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("loop")
          .setEmoji("<:emoji_34:1447655858912759869>")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("shuffle")
          .setEmoji("<:emoji_33:1447655855955775614>")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("save")
          .setEmoji("<:emoji_31:1447655861857157192>")
          .setStyle(ButtonStyle.Secondary)
      );
      const specialFilterRow = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("filterSelect")
          .setPlaceholder("Select a filter...")
          .addOptions([
            { label: "Bass Boost", description: "Apply Bassboost Filter To Current Playing", emoji: "<:filtersss:1447655863560179945>", value: "bassboost" },
            { label: "Nightcore", description: "Apply Nightcore Filter To Current Playing", emoji: "<:filtersss:1447655863560179945>", value: "nightcore" },
            { label: "Vaporwave", description: "Apply Vaporwave Filter To Current Playing", emoji: "<:filtersss:1447655863560179945>", value: "vaporwave" },
            { label: "Tremolo", description: "Apply Tremolo Filter To Current Playing", emoji: "<:filtersss:1447655863560179945>", value: "tremolo" },
            { label: "Vibrato", description: "Apply Vibrato Filter To Current Playing", emoji: "<:filtersss:1447655863560179945>", value: "vibrato" },
            { label: "Karaoke", description: "Apply Karaoke Filter To Current Playing", emoji: "<:filtersss:1447655863560179945>", value: "karaoke" },
            { label: "Distortion", description: "Apply Distortion Filter To Current Playing", emoji: "<:filtersss:1447655863560179945>", value: "distortion" },
            { label: "None", description: "Reset All Filters From Current Playing", emoji: "<:replay:1447943600930426903>", value: "none" },
          ])
      );
      rows.push(specialFilterRow, specialrow1, specialrow2);
      break;

    case "noButtons":
      return rows;

    case "oldschool":
      const oldSchoolRow = new ActionRowBuilder();
      oldSchoolRow.addComponents(
        new ButtonBuilder()
          .setCustomId("previous")
          .setEmoji("<:previous:1447654447386722386>")
          .setLabel("Previous")
          .setDisabled(!player.previousTrack)
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("pause")
          .setEmoji(player.paused ? "<:resume:1447654449567764603>" : "<:pause:1447654451698597928>")
          .setLabel(player.paused ? "Resume" : "Pause")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("skip")
          .setEmoji("<:skip:1447654453791686820>")
          .setLabel("Skip")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("stop")
          .setEmoji("<:stop:1447654455955685426>")
          .setLabel("Stop")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("replay")
          .setEmoji("<:replayy:1447654655395102772>")
          .setLabel("Replay")
          .setStyle(ButtonStyle.Secondary)
      );
      rows.push(oldSchoolRow);
      break;

    default:
      console.warn(`Unrecognized mode: ${mode}. No buttons generated.`);
      break;
  }

  return rows;
}

async function handleInteraction(interaction, player, client, track, nplaying, embeded, mode) {
  const id = interaction.customId;
  switch (id) {
    case "pause":
      await handlePause(player, interaction, nplaying, embeded, mode);
      break;
    case "skip":
      await handleSkip(player, interaction, nplaying, embeded, mode);
      break;
    case "stop":
      await handleStop(player, interaction, nplaying);
      break;
    case "replay":
      await handleReplay(player, interaction, nplaying, embeded, mode);
      break;
    case "shuffle":
      await handleShuffle(player, interaction);
      break;
    case "previous":
      await handlePrevious(player, interaction, nplaying, embeded, mode);
      break;
    case "volumeUp":
      await handleVolumeUp(player, interaction);
      break;
    case "volumeDown":
      await handleVolumeDown(player, interaction);
      break;
    case "loop":
      await handleLoop(player, interaction);
      break;
    case "save":
      await handleSave(interaction, track, client);
      break;
  }
}

async function handlePause(player, interaction, nplaying, embeded, mode) {
  await player.pause(!player.paused);
  const pauseState = player.paused ? "Paused" : "Resumed";
  const pauseEmbed = new EmbedBuilder()
    .setDescription(`<:sec_tick:1447943806631809196> | **Song has been:** \`${pauseState}\``)
    .setColor("#00FF00");

  await interaction.update({ embeds: [embeded], components: setupPlayerButtons(player, player.currentTrack, mode) });
  interaction.followUp({ embeds: [pauseEmbed], ephemeral: true });
}

async function handleSkip(player, interaction, nplaying, embeded, mode) {
  // Remove buttons/filter menu from the previous message
  await nplaying.edit({ components: [] });

  await player.skip();
  const skipEmbed = new EmbedBuilder()
    .setDescription("<:sec_tick:1447943806631809196> | **Song has been:** `Skipped`")
    .setColor("#00FF00");

  interaction.reply({ embeds: [skipEmbed], ephemeral: true });
}

async function handleStop(player, interaction, nplaying) {
  if (!player) {
    return; // Player does not exist
  }

  await player.setLoop("none");
  await player.data.set("autoplay", false);
  await player.queue.clear();
  await player.skip();

  const stopEmbed = new EmbedBuilder()
    .setDescription("<:sec_tick:1447943806631809196> | **Song has been:** `Stopped`")
    .setColor("#FF0000");

  try {
    // Remove components here as well
    await nplaying.edit({ embeds: [stopEmbed], components: [] });
  } catch (error) {
    console.error("Error editing message:", error);
  }

  await interaction.reply({ embeds: [stopEmbed], ephemeral: true });
}




async function handleReplay(player, interaction, nplaying, embeded, mode) {
  await player.seek(0);
  const replayEmbed = new EmbedBuilder()
    .setDescription("<:sec_tick:1447943806631809196> | **Song has been:** `Replayed`")
    .setColor("#00FF00");

  await nplaying.edit({ embeds: [embeded], components: setupPlayerButtons(player, player.currentTrack, mode) });
  interaction.reply({ embeds: [replayEmbed], ephemeral: true });
}

async function handleShuffle(player, interaction) {
  await player.queue.shuffle();
  const shuffleEmbed = new EmbedBuilder()
    .setDescription(`<:sec_tick:1447943806631809196> | **Queue has been:** \`Shuffled\``)
    .setColor("#00FF00");

  interaction.reply({ embeds: [shuffleEmbed], ephemeral: true });
}

async function handlePrevious(player, interaction, nplaying, embeded, mode) {
  const previousTrack = player.previousTrack;
  if (!previousTrack) {
    const errorEmbed = new EmbedBuilder()
      .setColor("#FF0000")
      .setDescription("**No Previous Track to Play**");
    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
  }

  // Play the previous track
  await player.play(previousTrack);
  const backEmbed = new EmbedBuilder()
    .setDescription("<:sec_tick:1447943806631809196> | **Replaying Previous Track**")
    .setColor("#00FF00");

  await nplaying.edit({ embeds: [embeded], components: [] });
  interaction.reply({ embeds: [backEmbed], ephemeral: true });
}

async function handleVolumeUp(player, interaction) {
  let volumeUp = player.volume + 10;
  if (volumeUp > 100) volumeUp = 100;
  player.setVolume(volumeUp);
  interaction.reply({ content: `Volume increased to ${volumeUp}.`, ephemeral: true });
}

async function handleVolumeDown(player, interaction) {
  let volumeDown = player.volume - 10;
  if (volumeDown < 0) volumeDown = 0;
  player.setVolume(volumeDown);
  interaction.reply({ content: `Volume decreased to ${volumeDown}.`, ephemeral: true });
}

async function handleLoop(player, interaction) {
  if (player.loop === "none") {
    player.setLoop("track");
    interaction.reply({ content: "Looping current track.", ephemeral: true });
  } else {
    player.setLoop("none");
    interaction.reply({ content: "Loop disabled.", ephemeral: true });
  }
}

async function handleSave(interaction, track, client) {
  const savedEmbed = new EmbedBuilder()
    .setAuthor({ name: "Saved song to DM", iconURL: client.user.displayAvatarURL() })
    .setDescription(
      `<:NeXPlaylist:1447642539485167646> | **Saved [${track.title}](${client.config.ssLink}) to your DM.**`
    )
    .addFields(
      { name: "Song Duration", value: `\`${convertMilliseconds(track.length)}\``, inline: true },
      { name: "Song Author", value: `\`${track.author || "Unknown"}\``, inline: true },
      { name: "Requested Guild", value: `\`${interaction.guild.name}\``, inline: true }
    )
    .setThumbnail(`${track.thumbnail}`)
    .setColor(client.color);

  try {
    await interaction.user.send({ embeds: [savedEmbed] });
    interaction.reply({ content: "<:sec_tick:1447943806631809196> | Song saved to your DM!", ephemeral: true });
  } catch (error) {
    interaction.reply({
      content: "<:Crossmark:1447578705198055484> | Unable to send DM. Please enable DMs and try again.",
      ephemeral: true,
    });
  }
}

});
}

function convertMilliseconds(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const hoursStr = hours > 0 ? hours + ":" : "";
  const minutesStr = minutes < 10 ? "0" + minutes : minutes;
  const secondsStr = seconds < 10 ? "0" + seconds : seconds;

  return `${hoursStr}${minutesStr}:${secondsStr}`;
}
