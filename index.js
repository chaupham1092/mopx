const express = require('express');
const axios = require('axios');
const Papa = require('papaparse');
const cors = require('cors'); // Allow frontend requests

const app = express();
app.use(cors()); // Enable CORS for all routes

const csvUrl = 'https://catalog.ourworldindata.org/explorers/who/latest/monkeypox/monkeypox.csv';

// API endpoint to serve processed data
app.get('/monkeypox-data', async (req, res) => {
    try {
        const response = await axios.get(csvUrl);
        const csvData = response.data;

        Papa.parse(csvData, {
            header: true,
            complete: (result) => {
                const processedData = {};
                
                // Process the CSV data (grouping by date)
                result.data.forEach(row => {
                    if (row.location !== 'Africa') { // Filter out Africa
                        const date = row.date;
                        const cases = Number(row.total_cases) || 0;

                        if (!processedData[date]) {
                            processedData[date] = 0;
                        }
                        processedData[date] += cases; // Sum cases for each date
                    }
                });

                // Convert object to array
                const dates = Object.keys(processedData);
                const totalCases = dates.map(date => processedData[date]);

                res.json({ dates, totalCases });
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
