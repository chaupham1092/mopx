// Function to load and parse CSV data from the provided URL
function loadCSV() {
    const csvUrl = 'https://catalog.ourworldindata.org/explorers/who/latest/monkeypox/monkeypox.csv';
    
    fetch(csvUrl)
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n');
            const dates = [];
            const totalCases = [];

            // Skip the first line (header) and loop through each row
            rows.slice(1).forEach(row => {
                const cells = row.split(',');

                // Check if the row contains data and filter for world-level data (not Africa)
                if (cells.length > 1 && cells[0] !== 'Africa') {  // Filter for world-level data
                    dates.push(cells[1]);
                    totalCases.push(Number(cells[3]));  // Total cases column
                }
            });

            // Create chart with the parsed data
            createChart(dates, totalCases);
        })
        .catch(error => console.error('Error loading CSV data:', error));
}

// Function to create the chart
function createChart(dates, totalCases) {
    const ctx = document.getElementById('totalCasesChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Total Monkeypox Cases Worldwide',
                data: totalCases,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Total Monkeypox Cases Worldwide Over Time'
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return tooltipItem.raw.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'category',
                    title: {
                        display: true,
                        text: 'Date'
                    },
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Total Cases'
                    },
                    type: 'logarithmic',  // Apply logarithmic scale
                    ticks: {
                        // Optional: Customize tick marks
                        callback: function(value, index, values) {
                            return value.toLocaleString();  // Format tick labels with commas
                        }
                    }
                }
            }
        }
    });
}

// Load the CSV data on page load
window.onload = loadCSV;
