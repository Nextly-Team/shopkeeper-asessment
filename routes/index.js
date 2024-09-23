var express = require('express');
var router = express.Router();
const DealsHistoryController = require('../api/controllers/deals_listings.controller')
const SitesController = require('../api/controllers/sites.controller')
const Utils = require('../api/helpers/utils')


/* GET home page. */
router.get('/', async (req, res, next) => {

  const { broker, daterange: queryDateRange } = req.query
  const { daterange, startDate, endDate } = Utils.getDateRange(queryDateRange)

  const brokers = await SitesController.findAll()
  const totalBrokers = brokers.length
  const lineChartLabels = Utils.listMonths({ startDate, endDate })
  const lineChartData = JSON.stringify(await DealsHistoryController.findDealsListingPerMonthSum({ broker, startDate, endDate, totalMonths: lineChartLabels.totalMonths, listMonths: lineChartLabels.label, totalBrokers }))

  let show = false
  const tableData = await DealsHistoryController.findDealsListingPerMonth({ broker, startDate, endDate })
  const totalPage = tableData.deals.length
  const totalDeals = tableData.totalDeals
  const totalRevenue = tableData.totalRevenue
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
      totalPage: totalPage,
      totalRevenue: totalRevenue,
      totalDeals: totalDeals
    },
    tableAverage: {
      rows: tableData.average,
      totalPage: totalPage,
      totalDeals: totalDeals
    },
    brokers: brokers,
    dateRange: daterange,
    show: show,
    brokerSelected: broker
  });
});


module.exports = router;
