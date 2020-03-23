require('dotenv').config();
const { Client, MessageEmbed } = require('discord.js');
const { token, prefix, appName } = require('./config/settings');

const TOKEN = process.env.TOKEN || "Njg5NDgyNjg2MDM2NzA1Mjgx.XneN-w.7MKSvaVaavS6ihXkWZPJuA3LTtc";

const customEmbeb = require('./embeb');

const { getNcovidStatisticsByCountry, getCountries } = require('./ncovid')

const { crawlData } = require('./crawlData')

const client = new Client();


client.on('ready', () => {
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

    setInterval(() => {

        const random = Math.floor(Math.random() * statuses.length);

        let { type, activity } = statuses[random]

        client.user.setActivity(activity, {
            type
        });

    }, 300000);

    console.log('Ready!')
});

client.on('message', async (msg) => {

    if (msg.author.bot) return;

    let args = msg.content.substring(prefix.length).toLowerCase().split(" ");

    if (args[0] === appName) {
        console.log(args, msg.content)
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
                            crawlData().then(async (data) => {
                                const newtNcovid19 = await getNcovidStatisticsByCountry(args[2]);

                                if (args[2] !== newtNcovid19.title.toLowerCase()) {
                                    msg.channel.send(`Found ${newtNcovid19.title}`);
                                }
                                await msg.channel.send(new MessageEmbed(newtNcovid19))
                            }).catch(() => {
                                msg.channel.send("Failed to get data");
                            });
                            break;
                    }
                } else {
                    crawlData().then(async (data) => {
                        const newtNcovid19 = await getNcovidStatisticsByCountry('Vietnam');
                        await msg.channel.send(new MessageEmbed(newtNcovid19))
                    }).catch(() => {
                        msg.channel.send("Failed to get data");
                    });
                    break;
                }
                break;
            case "hi":
                msg.reply('Hi con cặc');

                msg.channel.send("Please do '!db help' instead");

                break;
            case "wake":
                let users = '';
                if (args.length >= 2) {
                    for (let index = 2; index < args.length; index++) {
                        if (args[index].startsWith('<@!') && args[index].endsWith('>')) {
                            users += ` ${args[index]}`;
                        }
                    }
                }
                console.log(users)
                msg.reply('says: Wake the fuck up' + (users != '' ? users : '!!!'));

                // msg.channel.send("Please do '!db help' instead");

                break;
            default:
                msg.channel.send("Do '!db help'");
                break;
        }
    }
});


client.login(TOKEN);