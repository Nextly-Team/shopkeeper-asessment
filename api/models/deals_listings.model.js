const db = require('../database/Postgres.database')
const { ParameterizedQuery: PQ } = require('pg-promise')

const whereLinstingPerMonth = async (queryString) => {
    const { broker, startDate, endDate } = queryString
    let where = ""
    if (broker)
        where += ` AND site_id = ${broker}`
    if (startDate && endDate) {
        where += ` AND date(d.created_at) BETWEEN '${startDate}' AND '${endDate}'`
    } else {
        where += ` AND date(d.created_at) BETWEEN '2020-11-01' AND '2021-11-30'`
    }
    return where
}

const findDealsListingPerMonthSum = async (queryString) => {
    const where = await whereLinstingPerMonth(queryString)

    const findDealsListingPerMonthQuery = new PQ({
        text:
            `SELECT s.slug as sites_slug, site_id, count(d.url), extract(month from date(d.created_at)) as month_creation, extract(YEAR from date(d.created_at)) as year_creation \
        FROM deals d \
        JOIN sites s ON s.id = site_id \
        WHERE d.status='New Listing' and d.removed = FALSE ${where} \
        GROUP BY site_id, sites_slug, month_creation, year_creation \
        ORDER BY site_id asc, month_creation asc, year_creation asc\
        LIMIT 100;` })
    return await db.any(findDealsListingPerMonthQuery)
}

const findDealsListingPerMonth = async (queryString) => {
    const where = await whereLinstingPerMonth(queryString)
    const findDealsListingPerMonthQuery = new PQ({
        text:
            `SELECT s.slug as sites_slug, d.slug, date(d.listing_date) as date, extract(month from date(d.created_at)) as month_creation, extract(YEAR from date(d.created_at)) as year_creation, d.revenue  \
        FROM deals d \
        JOIN sites s ON s.id = site_id \
        WHERE d.status='New Listing' and d.removed = FALSE ${where} \
        ORDER BY d.slug asc, site_id asc, year_creation asc, month_creation asc, d.date asc \
        LIMIT 100;` })
    return await db.any(findDealsListingPerMonthQuery)
}

module.exports = { findDealsListingPerMonthSum, findDealsListingPerMonth }


