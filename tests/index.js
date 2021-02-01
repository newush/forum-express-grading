const request = require('supertest')
const restController = require('../controllers/restController.js')
const app = require('../app')

describe('# 測試環境初始化', function () {

  context('# First Test Case', () => {

    it(" GET /admin/users ", (done) => {
      request(app)
        .get('/')
        .end(function (err, res) {
          done()
        });
    });

  })
})

module.exports = app => {
  app.get('/', (req, res) => res.render('/'))
}