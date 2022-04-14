const Discord = require('discord.js');

const testDiscordWebhook = async (webhook) => {
    webhook = webhook.split('/webhooks/').pop();
    let id = await webhook.match(/[^/]+/);
    let token = await webhook.match(/[^/]+$/);
    console.log(token);
    console.log(id)
    
    const hook = new Discord.WebhookClient(id, token);
    const embed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Connected with FB Scrape 🟢')
        .setDescription('All new listings that match your filters will appear here.')
    
    return hook.send(embed);
};

module.exports = { testDiscordWebhook };