// main.js
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const axios = require('axios');
const https = require('https');
const fs = require('fs');
const path = require('path')
const cheerio = require('cheerio');

const countryCode = require('./countryCode');

const pages = [
    {
        url: "https://www.worldometers.info/coronavirus/",
        fileName: 'worldometers.html',
        extractData: (html) => {
            let all = null;
            const $ = cheerio.load(html);

            const worldwide1 = $('.maincounter-number')
            const worldwide2 = $('.number-table-main')
            const worldwide3 = $('.number-table')
            const allCases = $(worldwide1[0]).text().trim();
            const deathCases = $(worldwide1[1]).text().trim();
            const recoveredCases = $(worldwide2[1]).text().trim();
            const activeCase = $(worldwide2[0]).text().trim();
            const mildConditionCases = $(worldwide3[0]).text().trim();
            const seriousCases = $(worldwide3[1]).text().trim();
            console.log($(worldwide3[0]).text().trim(),
            $(worldwide3[1]).text().trim(),
            $(worldwide3[2]).text().trim(),
            $(worldwide3[3]).text().trim())
            if (all == null)
                all = [];
            all.push({
                country: 'Worldwide',
                // code: countryCode[$(row[0]).text().trim()],
                cases: allCases,
                newCases: '',
                dead: deathCases,
                newDead: '',
                recovered: recoveredCases,
                acticeCases: activeCase,
                seriousCases,
                mildConditionCases
            });
            
            console.log(all)
            //countries
            const table = $('#main_table_countries_today tbody')[0];

            $($(table).children()).each((index, tr) => {
                if (all == null)
                    all = [];
                const row = $($(tr).children())
                all.push({
                    country: $(row[0]).text().trim(),
                    // code: countryCode[$(row[0]).text().trim()],
                    cases: $(row[1]).text().trim(),
                    newCases: $(row[2]).text().trim(),
                    dead: $(row[3]).text().trim(),
                    newDead: $(row[4]).text().trim(),
                    recovered: $(row[5]).text().trim(),
                    acticeCases: $(row[6]).text().trim(),
                    seriousCases: $(row[7]).text().trim(),
                    totalPerMil: $(row[8]).text().trim(),
                });
            });

            // console.log(all[0])
            // console.log(all)
            return all;
        }
    }
];

const fetchData = async (url) => {
    console.log("Crawling data...")
    // make http call to url
    let response = await axios({
        url,
        method: 'GET',
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        responseType: 'text/html'
    });
    return response;
}

const crawlData = () => {
    return new Promise((resolve, reject) => {
        pages.forEach((page) => {
            fetchData(page.url).then((response) => {
                const pageData = page.extractData(response.data);

                if (pageData == null) return;

                const filePath = path.resolve(__dirname, 'data.json');

                fs.readFile(filePath, (err, data) => {
                    if (err) throw err;
                    let fileData;

                    if (!data) return;
                    fileData = JSON.parse(data);



                    if (fileData.length === 0) {
                        fileData = pageData;
                    } else {
                        pageData.forEach((pData) => {
                            const index = fileData.findIndex((fData) => {
                                return fData.country === pData.country;
                            });

                            if (index === -1) {
                                fileData.push(pData);
                            } else {
                                const isNew = (pData.cases && pData.cases > fileData[index].cases)
                                    || (pData.dead && pData.dead > fileData[index].dead)
                                    || (pData.recovered && pData.recovered > fileData[index].recovered);

                                if (isNew) {
                                    fileData[index].cases = pData.cases;
                                    fileData[index].dead = pData.dead;
                                    fileData[index].recovered = pData.recovered;
                                }
                            }
                        })
                    }

                    fs.writeFile(filePath, JSON.stringify(fileData), (err, data) => {
                        if (err) throw err;

                        console.log(data);
                        resolve(data);
                    });
                })

            }).catch((e) => {
                console.log(e);
                reject(e);
            });
        });
    })


}

module.exports = { crawlData }