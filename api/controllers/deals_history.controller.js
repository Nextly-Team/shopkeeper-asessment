const DealHistoryService = require('../services/deals_history.service')
const findDeal = async () => {
    const service = await DealHistoryService.findDeal()
    return service
}

const findDealsListingPerMonthSum = async (queryString) => {
    return await DealHistoryService.findDealsListingPerMonthSum(queryString)
}

const findDealsListingPerMonth = async (queryString) => {
    return await DealHistoryService.findDealsListingPerMonth(queryString)

}
findDealsListingPerMonth

module.exports = { findDeal, findDealsListingPerMonthSum, findDealsListingPerMonth }