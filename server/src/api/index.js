const test = require('./test')

const api = require('express').Router()

api.use('/test', test)

module.exports = api