const express = require('express');
const axios = require('axios');
const Papa = require('papaparse');
const app = express();

const csvUrl = 'https://catalog.ourworldindata.org/explorers/who/latest/monkeypox/monkeypox.csv';

// Endpoint to fetch the data and process it
app.get('/monkeypox-data', async (req, res) => {
    try {
        const response = await axios.get(csvUrl);
        const csvData = response.data;

        // Parse CSV data
        Papa.parse(csvData, {
            complete: (result) => {
                const dates = [];
                const totalCases = [];

                // Process the CSV data (filter for non-Africa data)
                result.data.forEach(row => {
                    if (row.location !== 'Africa') {  // Skip Africa
                        dates.push(row.date);
                        totalCases.push(Number(row.total_cases));
                    }
                });

                // Send processed data as JSON
                res.json({ dates, totalCases });
            },
            header: true
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
