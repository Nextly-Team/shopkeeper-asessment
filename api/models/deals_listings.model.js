const db = require('../database/Postgres.database')
const { ParameterizedQuery: PQ } = require('pg-promise')

const whereLinstingPerMonth = async (queryString) => {
    const { broker, startDate, endDate } = queryString
    let where = ""

    if (startDate && endDate) {
        where += ` d.listing_date BETWEEN '${startDate}' AND '${endDate}'`
    } else {
        where += ` d.listing_date BETWEEN '2020-11-01' AND '2021-11-30'`
    }
    if (broker)
        where += ` AND site_id = ${broker}`

    return where
}

const findDealsListingPerMonthSum = async (queryString) => {
    const where = await whereLinstingPerMonth(queryString)

    const findDealsListingPerMonthQuery = new PQ({
        text:
            `SELECT s.slug as sites_slug, site_id, d.url, count(d.url), extract(month from d.listing_date) as month_creation, extract(YEAR from d.listing_date) as year_creation \
        FROM deals d \
        JOIN sites s ON s.id = site_id \
        WHERE ${where} and revenue > 0 \
        GROUP BY site_id, sites_slug, month_creation, year_creation, d.url \
        ORDER BY site_id asc, month_creation asc, year_creation asc;` })
    return await db.any(findDealsListingPerMonthQuery)
}

const findDealsListingPerMonth = async (queryString) => {
    const where = await whereLinstingPerMonth(queryString)
    const findDealsListingPerMonthQuery = new PQ({
        text:
            `SELECT s.slug as sites_slug, d.url, d.slug, date(d.listing_date) as date, extract(month from d.listing_date) as month_creation, extract(YEAR from d.listing_date) as year_creation, d.revenue  \
        FROM deals d \
        JOIN sites s ON s.id = site_id \
        WHERE ${where} and revenue > 0 \
        ORDER BY sites_slug asc, date asc, year_creation asc, month_creation asc;` })
    return await db.any(findDealsListingPerMonthQuery)
}

module.exports = { findDealsListingPerMonthSum, findDealsListingPerMonth }


