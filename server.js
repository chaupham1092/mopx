const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

// Your API keys
const serpApiKey = 'b64ec61a80c4529e802840fa1aecf2175a29565bfdcd5fca136736862d415d9d';
const ipstackApiKey = '8999b410d509b3357dbd1d4357ba0253';

// Serve static files from the "public" folder
app.use(express.static('public'));

// Serve index.html when accessing the root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to check local search performance
app.get('/api/check-performance', async (req, res) => {
  const { keyword, location } = req.query;

  if (!keyword || !location) {
    return res.json({ success: false, message: "Keyword and location are required." });
  }

  try {
    // Step 1: Get geolocation info from ipstack
    const geoResponse = await axios.get(`http://api.ipstack.com/${location}?access_key=${ipstackApiKey}`);
    const { latitude, longitude } = geoResponse.data;

    // Step 2: Use SerpApi to get Google search results for the keyword
    const serpApiResponse = await axios.get(`https://serpapi.com/search.json`, {
      params: {
        engine: 'google',
        q: keyword,
        location: location,
        api_key: serpApiKey
      }
    });

    // Step 3: Extract ranking info from SerpApi response
    const results = serpApiResponse.data.organic_results || [];
    let rank = results.findIndex(result => result.link.includes('your-business-website.com')) + 1; // Adjust with your website
    if (rank === 0) rank = 'Not ranked in top results';

    // Step 4: Compare with competitors
    const competitors = results.slice(0, 5).map((result, index) => ({
      name: result.title,
      rank: index + 1
    }));

    // Step 5: Send data back to frontend
    res.json({
      success: true,
      rank,
      competitors
    });
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.json({ success: false, message: 'Error fetching data from APIs.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
