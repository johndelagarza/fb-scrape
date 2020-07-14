const Discord = require('discord.js');

const discordNotify = (id, token, product) => {
    const hook = new Discord.WebhookClient(id, token);
    const embed = new Discord.RichEmbed()
	.setColor('#0099ff')
	.setTitle(product.title)
	.setURL(product.url)
    .addField('Price:', product.price)
    .addField('Location', product.location)
	.setImage(product.image)
	.setTimestamp();
    
    return hook.send(embed);
};

const testWebhook = (id, token) => {
    const hook = new Discord.WebhookClient(id, token);
    const embed = new Discord.RichEmbed()
        .setColor('#0099ff')
        .setTitle('Connected with FB Scrape 😎')
        .addField('Success:', 'You are good to go!')
    
    return hook.send(embed);
};

module.exports = { 
    discordNotify: discordNotify, 
    testWebhook: testWebhook 
};

