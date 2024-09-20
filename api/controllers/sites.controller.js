const SitesService = require('../services/sites.service')

const findAll = async () => {
    return await SitesService.findAll()
}

module.exports = { findAll }