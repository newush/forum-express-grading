const db = require('../models')
const restaurant = require('../models/restaurant')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User
const Favorite = db.Favorite
const pageLimit = 10

const restController = {
  getRestaurants: (req, res) => {
    let offset = 0
    const whereQuery = {}
    let categoryId = ''
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery.CategoryId = categoryId
    }
    Restaurant.findAndCountAll({
      include: Category,
      where: whereQuery,
      limit: pageLimit
    }).then(result => {
      const page = Number(req.query.page) || 1
      const pages = Math.ceil(result.count / pageLimit)
      const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1

      const data = result.rows.map(r => (
        {
          ...r.dataValues, //spread operator
          description: r.dataValues.description.substring(0, 50),
          categoryName: r.Category.name,
          isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(r.id),
          isLiked: req.user.LikedRestaurants.map(d => d.id).includes(r.id)
        }
      ))
      Category.findAll({
        raw: true,
        nest: true
      })
        .then(categories => {
          return res.render('restaurants', {
            restaurants: data,
            categories: categories,
            categoryId: categoryId,
            page: page,
            totalPage: totalPage,
            prev: prev,
            next: next
          })
        })
    })
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikedUsers' },
        { model: Comment, include: [User] }]
    }).then(async (restaurant) => {
      const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id) // 找出收藏此餐廳的 user
      const isLiked = restaurant.LikedUsers.map(d => d.id).includes(req.user.id)
      await restaurant.increment('viewCounts', { by: 1 })
      return res.render('restaurant', {
        restaurant: restaurant.toJSON(),
        isFavorited: isFavorited,
        isLiked: isLiked
      })
    })
  },
  getFeeds: (req, res) => {
    return Promise.all([
      Restaurant.findAll({
        limit: 10,
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [Category]
      }),
      Comment.findAll({
        limit: 10,
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant]
      })
    ]).then(([restaurants, comments]) => {
      return res.render('feeds', {
        restaurants: restaurants,
        comments: comments
      })
    })
  },
  getRestaurantDashboard: (req, res) => {
    Restaurant.findByPk(req.params.id, {
      include:
        [
          { model: Comment, include: [Restaurant] },
          { model: Category, include: [Restaurant] }]
    })
      .then(restaurant => {
        res.render('dashboard', {
          restaurant: restaurant.toJSON()
        })
      })
  },
  getTopRestaurant: (req, res) => {
    return Restaurant.findAll({
      include: [
        { model: User, as: 'FavoritedUsers' },
        { model: Favorite, as: 'FavoritedRestaurants' }
      ]
    }).then(restaurants => {
      restaurants = restaurants.map(restaurant => ({
        ...restaurant.dataValues,
        FavoritedCount: restaurant.FavoritedRestaurants.length,
        isFavorited: restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id)
      }))
      restaurants = restaurants.sort((a, b) => b.FavoritedCount - a.FavoritedCount)
      return res.render('top_restaurant',
        {
          restaurants: restaurants
        })
    })
  }
}
module.exports = restController
