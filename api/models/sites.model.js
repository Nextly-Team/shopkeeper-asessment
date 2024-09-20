const db = require('../database/Postgres.database')
const { ParameterizedQuery: PQ } = require('pg-promise')

const findAll = async () => {
    const findAllQuery = new PQ({ text: 'SELECT * FROM sites' });
    return await db.any(findAllQuery)
}

module.exports = { findAll }
