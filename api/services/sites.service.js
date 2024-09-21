const SitesModel = require('../models/sites.model')

const findAll = async () => {
    return await SitesModel.findAll()
}

module.exports = { findAll }