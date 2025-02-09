const express = require('express');
const axios = require('axios');
const Papa = require('papaparse');
const cors = require('cors');

const app = express();
app.use(cors());

const csvUrl = 'https://catalog.ourworldindata.org/explorers/who/latest/monkeypox/monkeypox.csv';

app.get('/monkeypox-data', async (req, res) => {
    try {
        const response = await axios.get(csvUrl);
        const csvData = response.data;

        Papa.parse(csvData, {
            complete: (result) => {
                const dates = [];
                const totalCases = [];
                const seenDates = new Set();  // Avoid duplicate dates

                result.data.forEach(row => {
                    if (row.location !== 'Africa' && row.date && row.total_cases) { 
                        if (!seenDates.has(row.date)) {  
                            seenDates.add(row.date);
                            dates.push(row.date);
                            totalCases.push(Number(row.total_cases));
                        }
                    }
                });

                res.json({ dates, totalCases });
            },
            header: true
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
