const helpEmbed = {
    color: 0x0099ff,
    title: 'Command list',
    fields: [
        {
            name: 'List all commands',
            value: '!db help',
        },
        {
            name: 'More info on a specific command',
            value: '!db help {command}',
        },
        {
            name: 'Ncovid statistics (default=vn)',
            value: '!db ncovid',
        },
        {
            name: 'Wake someone up',
            value: '!db wake @someone',
        }
    ],
    timestamp: new Date(),
    footer: {
        text: 'Please enjoy',
    },
};

const ncovidHelpEmbed = {
    color: 0x0099ff,
    title: 'Ncovid statistics',
    fields: [
        {
            name: 'Ncovid statistics (default=vn)',
            value: '!db ncovid {country}',
        },
        {
            name: 'List all supported country ',
            value: '!db ncovid countries',
        },
        {
            name: 'Update ncovid statistics',
            value: '!db ncovid update',
        }
    ],
    timestamp: new Date(),
    footer: {
        text: 'Please enjoy',
    },
};
const getEmbeb = (title, { fields, footerText }) => {
    return {
        color: 0x0099ff,
        title,
        fields,
        timestamp: new Date(),
        footer: {
            text: footerText,
        },
    }
}
module.exports = {
    helpEmbed,
    ncovidHelpEmbed,
    getEmbeb
}