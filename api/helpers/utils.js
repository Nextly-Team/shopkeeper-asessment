const getRandomInt = (min, max) => {
    const minCeiled = Math.ceil(min)
    const maxFloored = Math.floor(max)
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled)
}

const money = (value) => {
    const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
    if (Number.isInteger(value))
        value = value / 100
    return currency.format(value)
}

const getAverage = (deals) => {
    const groupDeals = deals.sort((a, b) => { if (a.sites_slug === b.sites_slug) { return a.url - deals.url } return a.sites_slug > b.sites_slug ? 1 : -1 }).reduce((acc, deal) => {
        if (!acc[deal.url]) {
            acc[deal.url] = []
        }
        acc[deal.url].push({ value: parseInt(deal.revenue), sitesSlug: deal.sites_slug })
        return acc
    }, {})
    const result = {}
    for (const url in groupDeals) {
        const sum = groupDeals[url].reduce((acc, item) => acc + item.value, 0)
        const average = sum / groupDeals[url].length
        let sitesSlug = [...groupDeals[url]][0].sitesSlug
        let parseUrl = url
        let parseSum = money(sum)
        let parseAverage = money(average)
        if (url.length > 20)
            parseUrl = `${url.substring(0, 20)}...`
        if (parseSum > 10)
            parseSum = `${parseSum.substring(0, 10)}...`
        if (parseAverage > 10)
            parseAverage = `${parseAverage.substring(0, 10)}...`

        result[url] = { sum: money(sum), parseSum, average: money(average), parseAverage, url, sitesSlug, parseUrl }
    }
    const list = []
    for (i = 0; i < 10; i++)
        list.push(Object.values(result)[i])
    return { ...list }
}


const getChartColors = (quantity) => {
    const CHART_COLORS = []
    for (let count = 0; count <= quantity; count++) {
        CHART_COLORS.push(`rgb(${getRandomInt(0, 255)}, ${getRandomInt(0, 255)}, ${getRandomInt(0, 255)})`)
    }
    return CHART_COLORS
}

const fillDealObject = (deal, CHART_COLORS, monthYear, data, label, index) => {
    data[monthYear.indexOf(`${deal.year_creation}-${deal.month_creation}`)] = data[monthYear.indexOf(`${deal.year_creation}-${deal.month_creation}`)] + parseInt(deal.count)
    label[deal.site_id] = { ...label[deal.site_id], label: deal.sites_slug, data: data, borderColor: CHART_COLORS[index - 1], backgroundColor: CHART_COLORS[index - 1] }

    return {
        data,
        label
    }
}

const dealsResult = (deals) => {
    const result = deals.map(deal => {
        let parseUrl = deal.url
        let parseRevenue = money(deal.revenue)
        if (deal.url.length > 20)
            parseUrl = `${parseUrl.substring(0, 20)}...`
        if (parseRevenue > 10)
            parseRevenue = `${parseRevenue.substring(0, 10)}...`
        return {
            'listingId': parseUrl,
            'url': deal.url,
            'listingMonth': deal.monthCreation,
            'listingDate': new Date(deal.date).toISOString().split('T')[0],
            'broker': deal.sitesSlug,
            'revenue': money(deal.revenue),
            'parseRevenue': parseRevenue
        }
    })
    return [...result.slice(0, 10)];
}

const listMonths = (rangeDate) => {
    const { startDate, endDate } = rangeDate
    const startMonth = new Date(startDate).getMonth()
    const startYear = new Date(startDate).getFullYear()
    const endMonth = new Date(endDate).getMonth()
    const endYear = new Date(endDate).getFullYear()

    const totalEndMonth = endMonth + (12 * (endYear - startYear))
    const totalMonths = totalEndMonth - startMonth
    const list = []
    for (let count = 0; count <= totalMonths; count++) {
        const date = new Date(startDate)
        const eachDate = new Date(date.setMonth(date.getMonth() + count)).toISOString().substring(0, 7)
        list.push(eachDate)
    }
    return {
        label: list.join(','),
        totalMonths: totalMonths + 1
    }
}

const getDateRange = (daterange) => {
    if (!daterange) {
        daterange = '11/01/2020 - 11/30/2021'
    }
    const start = daterange.split('-')[0].trim().replaceAll('/', '-')
    const end = daterange.split('-')[1].trim().replaceAll('/', '-')
    startDate = `${start.split('-')[2]}-${start.split('-')[0]}-${start.split('-')[1]}`
    endDate = `${end.split('-')[2]}-${end.split('-')[0]}-${end.split('-')[1]}`

    return {
        startDate,
        endDate,
        daterange
    }
}

module.exports = {
    getRandomInt,
    money,
    getAverage,
    getChartColors,
    fillDealObject,
    dealsResult,
    listMonths,
    getDateRange
}