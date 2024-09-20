const DealService = require('../services/deals.service')
const findDeal = async () => {
    return await DealService.findDeal()
}

const findDealsListingPerMonth = async () => {
    return await DealService.findDealsListingPerMonth()
}

module.exports = { findDeal, findDealsListingPerMonth }