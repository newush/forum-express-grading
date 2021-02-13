'use strict'
const db = require('../models')
const faker = require('faker')
const Category = db.Category

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const categories = await Category.findAll({ rest: true, nest: true })

    await queryInterface.bulkInsert('Restaurants',
      Array.from({ length: 50 }).map((d, i) =>
      ({
        name: faker.name.findName(),
        tel: faker.phone.phoneNumber(),
        address: faker.address.streetAddress(),
        opening_hours: '08:00',
        image: `https://loremflickr.com/320/240/restaurant,food/?lock=${Math.random() * 100}`,
        description: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date(),
        CategoryId: categories[Math.floor(Math.random() * categories.length)].id
      })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Restaurants', null, {})
  }
}