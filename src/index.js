require('dotenv').config();
const { Client, MessageEmbed } = require('discord.js');
const { token, prefix, appName } = require('./config/settings');

const TOKEN = process.env.TOKEN;

const customEmbeb = require('./embeb');

const { getNcovidStatisticsByCountry, getCountries } = require('./ncovid')

const { crawlData } = require('./crawlData')

const client = new Client();
const statuses = [{
    type: 'PLAYING',
    activity: 'with your feelings'
}, {
    type: 'LISTENING',
    activity: 'the sound of nature'
}, {
    type: 'WATCHING',
    activity: 'myself highing af'
}];

client.on('ready', () => {
    setInterval(() => {

        const random = Math.floor(Math.random() * statuses.length);

        let { type, activity } = statuses[random]

        client.user.setStatus('online')

        client.user.setPresence({
            game: {
                name: activity,
                type,
                url: "https://www.facebook.com/vonhan3105"
            }
        });
        
        console.log(type, activity);
    }, 10000);

    console.log('Ready!')
});

client.on('message', async (msg) => {

    if (msg.author.bot) return;

    let args = msg.content.substring(prefix.length).split(" ");

    if (args[0] === appName) {

        switch (args[1]) {
            case "help":
                if (args[2]) {
                    switch (args[2]) {
                        case "ncovid":
                            msg.channel.send(new MessageEmbed(customEmbeb.ncovidHelpEmbed))
                            break;
                    }
                } else {
                    msg.channel.send(new MessageEmbed(customEmbeb.helpEmbed))
                }

                break;
            case "ncovid":
                if (args[2]) {
                    switch (args[2]) {
                        case "countries":
                            const countries = await getCountries();
                            await msg.channel.send(new MessageEmbed(countries))
                            break;
                        case "update":
                            msg.channel.send("Updating");

                            crawlData().then((data) => {
                                msg.channel.send("Updated");
                            }).catch(() => {
                                msg.channel.send("Failed to update");
                            });

                            break;
                        default:
                            const currentNcovid19 = await getNcovidStatisticsByCountry(args[2]);
                            await msg.channel.send(new MessageEmbed(currentNcovid19))
                            crawlData().then(async (data) => {
                                const newtNcovid19 = await getNcovidStatisticsByCountry(args[2]);
                                if (newtNcovid19.fields) {
                                    const rs = newtNcovid19.fields.some((e, index) => {
                                        return e.value !== currentNcovid19.fields[index].value;
                                    });
                                    if (rs) {
                                        msg.channel.send("New update");
                                        await msg.channel.send(new MessageEmbed(newtNcovid19))
                                    }
                                }
                            }).catch(() => {
                                msg.channel.send("Failed to update");
                            });
                            break;
                    }
                } else {
                    const currentNcovid19 = await getNcovidStatisticsByCountry('Vietnam');
                    await msg.channel.send(new MessageEmbed(currentNcovid19))
                    crawlData().then(async (data) => {
                        const newtNcovid19 = await getNcovidStatisticsByCountry('Vietnam');
                        if (newtNcovid19.fields) {
                            const rs = newtNcovid19.fields.some((e, index) => {
                                return e.value !== currentNcovid19.fields[index].value;
                            });
                            if (rs) {
                                msg.channel.send("New update");
                                await msg.channel.send(new MessageEmbed(newtNcovid19))
                            }
                        }
                    }).catch(() => {
                        msg.channel.send("Failed to update");
                    });
                    break;
                }
                break;
            case "hi":
                msg.reply('Hi con cặc');

                msg.channel.send("Please do '!db help' instead");

                break;
            default:
                msg.channel.send("Do '!db help'");
                break;
        }
    }
});


client.login(TOKEN);