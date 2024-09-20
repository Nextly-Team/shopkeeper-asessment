const DealsHistoryModel = require('../models/deals_listings.model')

const findDeal = async () => {
    const deals = await DealsHistoryModel.findDeal()
    return deals
}

const getRandomInt = (min, max) => {
    const minCeiled = Math.ceil(min)
    const maxFloored = Math.floor(max)
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled)
}

const findDealsListingPerMonthSum = async (queryString) => {
    const deals = await DealsHistoryModel.findDealsListingPerMonthSum(queryString)
    const { totalMonths, listMonths, totalBrokers } = queryString
    const label = []
    const CHART_COLORS = []
    for (let count = 0; count <= totalBrokers; count++) {
        CHART_COLORS.push(`rgb(${getRandomInt(0, 255)}, ${getRandomInt(0, 255)}, ${getRandomInt(0, 255)})`)
    }

    let data = Array(totalMonths).fill(0)
    const monthYear = listMonths.replaceAll("'", "").split(',')

    deals.map((deal, index, deals) => {
        let lastDeal = {}

        if (index > 0) {
            lastDeal = deals[index - 1]
            if (deal.site_id === lastDeal.site_id) {
                data[monthYear.indexOf(`${deal.year_creation}-${deal.month_creation}`)] = parseInt(deal.count)
                label[lastDeal.site_id] = { ...label[lastDeal.site_id], label: deal.sites_slug, data: data, borderColor: CHART_COLORS[index - 1], backgroundColor: CHART_COLORS[index - 1] }
            } else {
                data = Array(totalMonths).fill(0)
                data[monthYear.indexOf(`${deal.year_creation}-${deal.month_creation}`)] = parseInt(deal.count)
                label[deal.site_id] = { ...label[deal.site_id], label: deal.sites_slug, data: data, borderColor: CHART_COLORS[index - 1], backgroundColor: CHART_COLORS[index - 1] }
            }
            return label
        }
        data[monthYear.indexOf(`${deal.year_creation}-${deal.month_creation}`)] = parseInt(deal.count)
        label[deal.site_id] = { label: deal.sites_slug, data: data, borderColor: CHART_COLORS[index - 1], backgroundColor: CHART_COLORS[index - 1] }
        return label
    })

    return label.filter(x => x)
}
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

const getAverage = (deals) => {
    const groupDeals = deals.reduce((acc, deal) => {
        if (!acc[deal.sites_slug]) {
            acc[deal.sites_slug] = []
        }
        acc[deal.sites_slug].push(parseInt(deal.revenue))
        return acc
    }, {})

    const result = {}
    for (const sites_slug in groupDeals) {
        const sum = groupDeals[sites_slug].reduce((acc, value) => acc + value, 0)
        const average = sum / groupDeals[sites_slug].length
        result[sites_slug] = { sum: money.format(sum), average: money.format(average), sites_slug }
    }
    return result
}

const findDealsListingPerMonth = async (queryString) => {
    const deals = await DealsHistoryModel.findDealsListingPerMonth(queryString)

    const initialValue = 0
    const totalRevenue = deals.reduce((acc, data) => acc + parseInt(data.revenue), initialValue)
    const average = getAverage(deals)
    const dealsResult = deals.map(deal => {
        return {
            'listing_id': deal.slug,
            'listing_month': deal.month_creation,
            'listing_date': new Date(deal.date).toISOString().split('T')[0],
            'broker': deal.sites_slug,
            'revenue': money.format(deal.revenue),

        }
    })
    return {
        'deals': dealsResult,
        'total_revenue': money.format(totalRevenue),
        'average': average
    }
}

module.exports = { findDeal, findDealsListingPerMonthSum, findDealsListingPerMonth }