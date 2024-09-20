const DealsModel = require('../models/deals.model')

const findDeal = async () => {
    const deals = await DealsModel.findDeal()
    return deals
}

const findDealsListingPerMonth = async () => {
    const deals = await DealsModel.findDealsListingPerMonth()
    const label = []
    const CHART_COLORS = [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)',
        'rgb(201, 203, 207)',
        'rgb(77, 201, 246)',
        'rgb(246, 112, 25)',
    ];
    let data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    deals.map((deal, index, deals) => {
        let lastDeal = {}

        if (index > 0) {
            lastDeal = deals[index - 1]
            if (deal.site_id === lastDeal.site_id) {
                data[deal.month_creation - 1] = parseInt(deal.count)
                label[lastDeal.site_id] = { ...label[lastDeal.site_id], label: deal.sites_slug, data: data, borderColor: CHART_COLORS[index - 1], backgroundColor: CHART_COLORS[index - 1] }
            } else {
                data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                data[deal.month_creation - 1] = parseInt(deal.count)
                label[deal.site_id] = { ...label[deal.site_id], label: deal.sites_slug, data: data, borderColor: CHART_COLORS[index - 1], backgroundColor: CHART_COLORS[index - 1] }
            }
            return label
        }
        data[deal.month_creation - 1] = parseInt(deal.count)
        label[deal.site_id] = { label: deal.sites_slug, data: data, borderColor: CHART_COLORS[index - 1], backgroundColor: CHART_COLORS[index - 1] }
        return label
    })

    return label.filter(x => x)
}

module.exports = { findDeal, findDealsListingPerMonth }