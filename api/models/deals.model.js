const db = require('../database/Postgres.database')
const { ParameterizedQuery: PQ } = require('pg-promise')

const findDeal = async () => {
    const findDealQuery = new PQ({ text: 'SELECT * FROM deals' });
    return await db.any(findDealQuery)
}

const findDealsListingPerMonth = async () => {
    const findDealsListingPerMonthQuery = new PQ({
        text:
            "SELECT sites.slug as sites_slug, site_id, count(deals.url), extract(month from date(deals.created_at)) as month_creation, extract(YEAR from date(deals.created_at)) as year_creation \
        FROM deals \
        JOIN sites ON sites.id = site_id \
        WHERE deals.status='New Listing' and deals.removed = FALSE and date(deals.created_at) BETWEEN '2020-11-01' AND '2021-11-30' \
        GROUP BY site_id, sites_slug, month_creation, year_creation \
        ORDER BY site_id asc, month_creation asc, year_creation asc;" })
    return await db.any(findDealsListingPerMonthQuery)
}

module.exports = { findDeal, findDealsListingPerMonth }

