'use strict'
const db = require('../models')
const faker = require('faker')
const Restaurant = db.Restaurant
const User = db.User

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await User.findAll({
      rest: true,
      nest: true
    })
    const restaurants = await Restaurant.findAll({
      rest: true,
      next: true
    })
    await queryInterface.bulkInsert('Comments',
      Array.from({ length: 20 }).map((d, i) =>
      ({
        text: faker.lorem.sentence(5, 2),
        userId: users[Math.floor(Math.random() * users.length)].id,
        restaurantId: restaurants[Math.floor(Math.random() * restaurants.length)].id,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', null, {})
  }
}
