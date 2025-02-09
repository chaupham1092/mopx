const apiUrl = 'https://monkeypox-api.onrender.com/monkeypox-data'; // Replace with your Render URL

// Function to fetch processed data from backend
function fetchData() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            createChart(data.dates, data.totalCases);
        })
        .catch(error => console.error('Error fetching data:', error));
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
                    type: 'logarithmic', // Log scale for better visualization
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// Load the data on page load
window.onload = fetchData;
