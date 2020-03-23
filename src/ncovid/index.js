const { getEmbeb } = require('../embeb');
const path = require('path');
const fs = require('fs');

const editDistance = (s1, s2) => {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    let costs = new Array();
    for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= s2.length; j++) {
            if (i == 0)
                costs[j] = j;
            else {
                if (j > 0) {
                    let newValue = costs[j - 1];
                    if (s1.charAt(i - 1) != s2.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue),
                            costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0)
            costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}

const similarity = (s1, s2) => {
    let longer = s1;
    let shorter = s2;
    if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
    }
    let longerLength = longer.length;
    if (longerLength == 0) {
        return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

exports.getCountries = () => {
    return new Promise(resolve => {
        let result = null;

        const filePath = path.resolve(__dirname, '../', 'crawlData', 'data.json');

        fs.readFile(filePath, (err, data) => {
            if (err) throw err;

            if (!data) return;
            let fileData = JSON.parse(data);

            let fields = [];
            let name = '';
            for (let key in fileData) {

                if (key % 2 === 0) {
                    name = fileData[key].country;
                } else {
                    fields.push({
                        name,
                        value: fileData[key].country
                    })
                }

            }

            result = getEmbeb('Supported countries', { fields, footerText: 'Nhan Thanh' })


            resolve(result);
        });
    });
}

exports.getNcovidStatisticsByCountry = (country) => {
    return new Promise(resolve => {
        let result = null;

        const filePath = path.resolve(__dirname, '../', 'crawlData', 'data.json');

        fs.readFile(filePath, (err, data) => {
            if (err) throw err;

            if (!data) return;
            let fileData = JSON.parse(data);

            let index = fileData.findIndex((fData) => {
                return similarity(fData.country, country) >= 0.5 || fData.country === country;
            });

            if (index !== -1) {
                let fields = []
                for (let key in fileData[index]) {
                    if (key !== 'country') {
                        const keyMatch = {
                            cases: 'Cases',
                            newCases: 'New cases',
                            dead: 'Death',
                            newDead: 'New deaths',
                            recovered: 'Recovered',
                            acticeCases: 'Active cases',
                            mildConditionCases:'Mild condition cases',
                            seriousCases: 'Serious/Critical',
                            totalPerMil: 'Total cases/1M pop'
                        };

                        const value = fileData[index][key].length !== 0 ? fileData[index][key] : 'none';

                        fields.push({
                            name: keyMatch[key],
                            value
                        })
                    }
                }

                result = getEmbeb(fileData[index].country, { fields, footerText: 'Nhan Thanh' })
                console.log(result)
            }

            resolve(result);
        });
    });
};