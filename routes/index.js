var express = require('express');
var router = express.Router();
const DealsHistoryController = require('../api/controllers/deals_listings.controller')
const SitesController = require('../api/controllers/sites.controller')
const Utils = require('../api/helpers/utils')


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

/* GET home page. */
router.get('/', async (req, res, next) => {

  const { broker, daterange: queryDateRange } = req.query
  const { daterange, startDate, endDate } = getDateRange(queryDateRange)

  const brokers = await SitesController.findAll()
  const totalBrokers = brokers.length
  const lineChartLabels = Utils.listMonths({ startDate, endDate })
  const lineChartData = JSON.stringify(await DealsHistoryController.findDealsListingPerMonthSum({ broker, startDate, endDate, totalMonths: lineChartLabels.totalMonths, listMonths: lineChartLabels.label, totalBrokers }))

  let show = false
  const tableData = await DealsHistoryController.findDealsListingPerMonth({ broker, startDate, endDate })
  const total = tableData.deals.length
  const totalRevenue = tableData.total_revenue
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
