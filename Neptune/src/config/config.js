module.exports = {
    token:
        process.env.token ||
        "YOUR_DISCORD_BOT_TOKEN_HERE",
    prefix: "+",
    color: "#202225",
    Mongo: "YOUR_MONGODB_CONNECTION_STRING_HERE",
    ownerIDS: ["YOUR_DISCORD_ID_HERE", "ANOTHER_OWNER_ID_HERE"],
    vote: true,
    image: "https://your-image-url-here.jpg",
    setupBgLink: "https://your-setup-background-image-url-here.jpg",
    invite: "https://discord.com/oauth2/authorize?client_id=YOUR_BOT_ID&permissions=8&integration_type=0&scope=bot",
    inviteTwo: "https://discord.com/oauth2/authorize?client_id=YOUR_BOT_ID&permissions=8&integration_type=0&scope=bot",
    inviteThree: "https://discord.com/oauth2/authorize?client_id=YOUR_BOT_ID&permissions=8&integration_type=0&scope=bot",
    ssLink: "https://discord.gg/YOUR_SUPPORT_SERVER",
    topGg: "",
    topgg_Api: "YOUR_TOP_GG_API_TOKEN_HERE",
    noprefixLogWebhook: "YOUR_WEBHOOK_URL_HERE",
    cmd_log: "YOUR_WEBHOOK_URL_HERE",
    error_log: "YOUR_WEBHOOK_URL_HERE",
    blacklist_log: "YOUR_WEBHOOK_URL_HERE",
    join_log: "YOUR_WEBHOOK_URL_HERE",
    leave_log: "YOUR_WEBHOOK_URL_HERE",
    spotiId: "YOUR_SPOTIFY_CLIENT_ID_HERE",
    spotiSecret: "YOUR_SPOTIFY_CLIENT_SECRET_HERE",
    nodes: [
        {
            name: "Neptune",
            url: "YOUR_LAVALINK_URL:PORT",
            auth: "YOUR_LAVALINK_PASSWORD",
            secure: false,
        },
    ],
};
