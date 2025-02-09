const apiUrl = 'https://mopx.onrender.com/monkeypox-data';  // Replace with Render URL

async function fetchData() {
    try {
        const response = await fetch(apiUrl);
        const { dates, totalCases } = await response.json();
        createChart(dates, totalCases);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

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
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Total Cases'
                    },
                    type: 'logarithmic',
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

window.onload = fetchData;
