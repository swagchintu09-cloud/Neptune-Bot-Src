const { Client, Collection, GatewayIntentBits, WebhookClient } = require("discord.js");
const mongoose = require("mongoose");
const { Connectors } = require("shoukaku");
const { Kazagumo, Plugins } = require("kazagumo");
const spotify = require("kazagumo-spotify");
const fs = require("fs");
const { ClusterClient, getInfo } = require("discord-hybrid-sharding");
const Deezer = require("kazagumo-deezer");
const Apple = require("kazagumo-apple");
const Topgg = require("@top-gg/sdk");

class MainClient extends Client {
  constructor() {
    super({
      shards: getInfo().SHARD_LIST,
      shardCount: getInfo().TOTAL_SHARDS,
      allowedMentions: {
        parse: ["roles", "users", "everyone"],
        repliedUser: false,
      },
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
      ],
    });

    this.config = require("../config/config");
    this.emoji = require("../config/emoji");
    this.color = this.config.color;
    this.invite = this.config.invite;

    // ✅ ClusterClient with safe spawn delay
    this.cluster = new ClusterClient(this, {
      shardCount: getInfo().TOTAL_SHARDS,
      delay: 10000, // 10 seconds between cluster spawns
      respawn: true // auto-restart if a cluster fails
    });

    this.topgg = new Topgg.Api(`${this.config.topgg_Api}`);
    this.error = new WebhookClient({ url: `${this.config.error_log}` });

    // Music system setup
    this.manager = new Kazagumo(
      {
        plugins: [
          new spotify({
            clientId: this.config.spotiId,
            clientSecret: this.config.spotiSecret,
            playlistPageLimit: 1,
            albumPageLimit: 1,
            searchLimit: 10,
            searchMarket: "US",
          }),
          new Plugins.PlayerMoved(this),
          new Deezer({ playlistLimit: 20 }),
          new Apple({ countryCode: "us", imageWidth: 600, imageHeight: 900 }),
        ],
        defaultSearchEngine: "jssearch",
        send: (guildId, payload) => {
          const guild = this.guilds.cache.get(guildId);
          if (guild) guild.shard.send(payload);
        },
      },
      new Connectors.DiscordJS(this),
      this.config.nodes
    );

    this.on("error", (error) => {
      this.error.send(`\`\`\`js\n${error.stack}\`\`\``);
    });
    process.on("unhandledRejection", (error) => console.log(error));
    process.on("uncaughtException", (error) => console.log(error));

    const client = this;
    ["aliases", "mcommands"].forEach((x) => (client[x] = new Collection()));
    ["command", "player", "node"].forEach((x) => require(`../handlers/${x}`)(client));
  }

  async ConnectMongo() {
    console.log("Connecting to Mongo....");
    mongoose.set("strictQuery", true);
    await mongoose.connect(this.config.Mongo);
    console.log("MONGO DATABASE CONNECTED");
  }

  async loadEvents() {
    fs.readdirSync("./src/events/").forEach((file) => {
      let eventName = file.split(".")[0];
      require(`${process.cwd()}/src/events/${file}`)(this);
      console.log(`> ${eventName} Events Loaded !!`);
    });
  }

  // ⚡ Login delay per cluster
  async connect() {
    const shardId = this.cluster?.id ?? 0; // current cluster id
    const delay = shardId * 10000; // login delay = cluster id * 10s
    console.log(`Cluster ${shardId} waiting ${delay}ms before login...`);
    await new Promise((res) => setTimeout(res, delay));

    return super.login(this.config.token);
  }
}

module.exports = MainClient;