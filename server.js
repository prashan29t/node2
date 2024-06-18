const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/search', async (req, res) => {
    const { linkedinUrl } = req.query;

    if (!linkedinUrl) {
        return res.status(400).send('Missing linkedinUrl parameter');
    }

    const apiUrl = `https://in.search.yahoo.com/search;_ylt=AwrKErVNX3FmBjYACSy6HAx.;_ylc=X1MDMjExNDcyMzAwMgRfcgMyBGZyAwRmcjIDcDpzLHY6c2ZwLG06c2ItdG9wBGdwcmlkA2F5OTdnakFxU04ucFMwS1NralRhYUEEbl9yc2x0AzAEbl9zdWdnAzQEb3JpZ2luA2luLnNlYXJjaC55YWhvby5jb20EcG9zAzAEcHFzdHIDBHBxc3RybAMwBHFzdHJsAzIwBHF1ZXJ5A2xpbmtlZGluJTIwamQlMjBtaWNoYWVscwR0X3N0bXADMTcxODcwNjAxMQ--?p=${encodeURIComponent(linkedinUrl)}&fr=sfp&fr2=p%3As%2Cv%3Asfp%2Cm%3Asb-top&iscqry=`;

    try {
        const response = await axios.get(apiUrl);
        const $ = cheerio.load(response.data);

        const firstGroup = $('div.grp.grp-talgo-facts').first();

        const connections = firstGroup.find('li:contains("Connections:")').first().text().trim().replace('Connections:', '').trim() || '';
        const worksFor = firstGroup.find('li:contains("Works For:")').first().text().trim().replace('Works For:', '').trim() || '';
        const education = firstGroup.find('li:contains("Education:")').first().text().trim().replace('Education:', '').trim() || '';
        const followers = firstGroup.find('li:contains("Followers:")').first().text().trim().replace('Followers:', '').trim() || '';
        const location = firstGroup.find('li:contains("Location:")').first().text().trim().replace('Location:', '').trim() || '';

        const data = {
            connections,
            worksFor,
            education,
            followers,
            location
        };

        res.json(data);
    } catch (error) {
        console.error('Error fetching profile data:', error);
        res.status(500).send('Error fetching profile data');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
