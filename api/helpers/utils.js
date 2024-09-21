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
        acc[deal.url].push({ value: parseInt(deal.revenue), sites_slug: deal.sites_slug })
        return acc
    }, {})
    const result = {}
    for (const url in groupDeals) {
        const sum = groupDeals[url].reduce((acc, item) => acc + item.value, 0)
        const average = sum / groupDeals[url].length
        let sites_slug = [...groupDeals[url]][0].sites_slug
        let parse_url = url
        let parse_sum = money(sum)
        let parse_average = money(average)
        if (url.length > 20)
            parse_url = `${url.substring(0, 20)}...`
        if (parse_sum > 10)
            parse_sum = `${parse_sum.substring(0, 10)}...`
        if (parse_average > 10)
            parse_average = `${parse_average.substring(0, 10)}...`

        result[url] = { sum: money(sum), parse_sum, average: money(average), parse_average, url, sites_slug, parse_url }
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
        let parse_url = deal.url
        let parse_revenue = money(deal.revenue)
        if (deal.url.length > 20)
            parse_url = `${parse_url.substring(0, 20)}...`
        if (parse_revenue > 10)
            parse_revenue = `${parse_revenue.substring(0, 10)}...`
        return {
            'listing_id': parse_url,
            'url': deal.url,
            'listing_month': deal.month_creation,
            'listing_date': new Date(deal.date).toISOString().split('T')[0],
            'broker': deal.sites_slug,
            'revenue': money(deal.revenue),
            'parse_revenue': parse_revenue
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
        list.push(`'${eachDate}'`)
    }
    return {
        label: list.join(','),
        totalMonths: totalMonths + 1
    }
}

module.exports = {
    getRandomInt,
    money,
    getAverage,
    getChartColors,
    fillDealObject,
    dealsResult,
    listMonths
}