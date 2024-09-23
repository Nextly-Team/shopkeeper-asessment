const ctx = document.getElementById('listingsChart');

const labels = document.body.querySelector('script[labels]').getAttribute('labels').split(',')
const datasets = JSON.parse(document.body.querySelector('script[datasets]').getAttribute('datasets'))

new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: datasets
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Listing per month'
            }
        }
    }
})
