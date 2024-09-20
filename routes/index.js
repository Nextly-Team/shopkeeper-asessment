var express = require('express');
var router = express.Router();
const DealsHistoryController = require('../api/controllers/deals_history.controller')
const SitesController = require('../api/controllers/sites.controller')

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

/* GET home page. */
router.get('/', async (req, res, next) => {

  const { broker, daterange } = req.query
  let startDate = '2020-11-01'
  let endDate = '2021-11-30'

  if (daterange) {
    const start = daterange.split('-')[0].trim().replaceAll('/', '-')
    const end = daterange.split('-')[1].trim().replaceAll('/', '-')
    startDate = `${start.split('-')[2]}-${start.split('-')[0]}-${start.split('-')[1]}`
    endDate = `${end.split('-')[2]}-${end.split('-')[0]}-${end.split('-')[1]}`
  }

  const brokers = await SitesController.findAll()
  const totalBrokers = brokers.length
  const lineChartLabels = listMonths({ startDate, endDate })
  const lineChartData = JSON.stringify(await DealsHistoryController.findDealsListingPerMonthSum({ broker, startDate, endDate, totalMonths: lineChartLabels.totalMonths, listMonths: lineChartLabels.label, totalBrokers }))
  const tableData = await DealsHistoryController.findDealsListingPerMonth({ broker, startDate, endDate })

  const total = tableData.deals.length
  const totalRevenue = tableData.total_revenue
  let show = false
  if (tableData.deals.length > 0)
    show = true

  res.render('main', {
    title: 'Shopkeeper Asessment',
    layout: 'index',
    lineChart: {
      labels: lineChartLabels.label,
      datasets: lineChartData
    },
    table: {
      rows: tableData.deals,
      total: total,
      total_revenue: totalRevenue
    },
    tableAverage: tableData.average,
    brokers: brokers,
    dateRange: daterange,
    show: show,
    brokerSelected: broker
  });
});


module.exports = router;
