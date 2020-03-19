const { Client } = require('discord.js');
const { token } = require('./config/settings');
const client = new Client();

client.on('ready', () => console.log('Ready!'));

client.on('message', msg => {
    if (msg.author.bot) return;

    if (msg.content.startsWith('owo')) {
        const message='uwu'
        msg.channel.send(message);
    }
});
//
client.on('guildMemberAdd', member => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.cache.find(ch => ch.name === 'member-log');
    
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;

    // Send the message, mentioning the member
    channel.send(`Welcome to the server, ${member}`);
});


client.login(token);