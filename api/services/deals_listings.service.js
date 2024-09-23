const DealsHistoryModel = require('../models/deals_listings.model')
const Utils = require('../helpers/utils')


const findDealsListingPerMonthSum = async (queryString) => {
    const deals = await DealsHistoryModel.findDealsListingPerMonthSum(queryString)
    const { totalMonths, listMonths, totalBrokers } = queryString
    let label = []
    let fillDeal = {}
    const CHART_COLORS = Utils.getChartColors(totalBrokers)

    let data = Array(totalMonths).fill(0)
    const monthYear = listMonths.replaceAll("'", "").split(',')

    deals.map((deal, index, deals) => {
        let lastDeal = {}
        if (index > 0) {
            lastDeal = deals[index - 1]
            if (deal.site_id !== lastDeal.site_id) {
                data = Array(totalMonths).fill(0)
            }
            fillDeal = Utils.fillDealObject(deal, CHART_COLORS, monthYear, data, label, index)
            data = fillDeal.data
            label = fillDeal.label
            return label
        }
        fillDeal = Utils.fillDealObject(deal, CHART_COLORS, monthYear, data, label, index)
        data = fillDeal.data
        label = fillDeal.label
        return label
    })

    return label.filter(x => x)
}

const findDealsListingPerMonth = async (queryString) => {
    const deals = await DealsHistoryModel.findDealsListingPerMonth(queryString)

    const totalRevenue = deals.reduce((acc, data) => acc + parseInt(data.revenue), 0)
    const average = Utils.getAverage(deals)
    const dealsResult = Utils.dealsResult(deals)
    return {
        'deals': dealsResult,
        'totalRevenue': Utils.money(totalRevenue),
        'average': average,
        'totalDeals': deals.length
    }
}

module.exports = { findDealsListingPerMonthSum, findDealsListingPerMonth }