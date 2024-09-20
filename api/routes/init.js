const express = require('express');
const RouterDeals = require('./deals.router')

const router = express.Router();

router.use('/deals', RouterDeals)

module.exports = router