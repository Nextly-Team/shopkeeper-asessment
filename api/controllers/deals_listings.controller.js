const DealHistoryService = require('../services/deals_listings.service')

const findDealsListingPerMonthSum = async (queryString) => {
    return await DealHistoryService.findDealsListingPerMonthSum(queryString)
}

const findDealsListingPerMonth = async (queryString) => {
    return await DealHistoryService.findDealsListingPerMonth(queryString)

}

module.exports = { findDealsListingPerMonthSum, findDealsListingPerMonth }