const express = require('express');
const DealsHistoryController = require('../controllers/deals_history.controller')

const router = express.Router();

router.get('/listings_sum', async (req, res) => {
    res.status(200).send({
        success: 'OK',
        data: await DealsHistoryController.findDealsListingPerMonthSum()
    });
});

router.get('/listings', async (req, res) => {
    res.status(200).send({
        success: 'OK',
        data: await DealsHistoryController.findDealsListingPerMonth()
    });
});

module.exports = router;