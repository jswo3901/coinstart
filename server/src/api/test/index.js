const testCtrl = require('./test.ctrl')
const test = require('express').Router()

test.route('/')
  .get(testCtrl.getTest)
  .post(testCtrl.postTest)

test.route('/:id')
  .get(testCtrl.getTestId)

module.exports = test