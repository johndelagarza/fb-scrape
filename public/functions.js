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

const sendDiscordNotification = async (webhook, type, message) => {
    console.log(type)
    webhook = webhook.split('/webhooks/').pop();
    let id = await webhook.match(/[^/]+/);
    let token = await webhook.match(/[^/]+$/);
    
    const hook = new Discord.WebhookClient(id, token);
    const embed = new Discord.MessageEmbed();

    switch (type) {
        case "TEST":
            embed
                .setColor('#0099ff')
                .setTitle('Connected with FB Scrape 🟢')
                .setDescription('All new listings that match your filters will appear here.')
                .setTimestamp();

            hook.send(embed);
            break;
        case "START":
            embed
                .setColor('#0099ff')
                .setTitle(message.title)
                .setDescription(message.description)
                .setTimestamp();

            hook.send(embed);
            break;
        case "STOP":
    
        break;
        case "NEW_LISTING":
            embed
                .setColor('#0099ff')
                .setTitle(message.title)
                .setURL(message.description.url)
                .addField('Price:', message.description.price)
                .addField('Location', message.description.location)
                .setImage(message.description.image)
                .setTimestamp();
                
            hook.send(embed);
            break;
        default:
            break;
    }

        // .setColor('#0099ff')
        // .setTitle(listing.title)
        // .setURL(listing.url)
        // .addField('Price:', listing.price)
        // .addField('Location', listing.location)
        // .setImage(listing.image)
        // .setTimestamp();
    // try {
    //     await hook.send(embed);
    // } catch (error) {
    //     return error;
    // }
    return;
};

module.exports = { testDiscordWebhook, sendDiscordNotification };