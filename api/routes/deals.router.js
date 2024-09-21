const express = require('express');
const DealsHistoryController = require('../controllers/deals_listings.controller')
const SitesController = require('../controllers/sites.controller')
const Utils = require('../helpers/utils')

const router = express.Router();

router.get('/listings_sum', async (req, res) => {
    const { broker, startDate, endDate } = req.query
    const brokers = await SitesController.findAll()
    const totalBrokers = brokers.length
    const lineChartLabels = Utils.listMonths({ startDate, endDate })
    res.status(200).send({
        success: 'OK',
        data: await DealsHistoryController.findDealsListingPerMonthSum({ broker, startDate, endDate, totalMonths: lineChartLabels.totalMonths, listMonths: lineChartLabels.label, totalBrokers })
    });
});

router.get('/listings', async (req, res) => {
    const { broker, startDate, endDate } = req.query
    res.status(200).send({
        success: 'OK',
        data: await DealsHistoryController.findDealsListingPerMonth({ broker, startDate, endDate })
    });
});

module.exports = router;