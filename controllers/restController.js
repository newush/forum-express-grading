const restController = {
  // 負責「瀏覽餐廳頁面」，就是去 render 一個 restaurants 的樣板
  getRestaurants: (req, res) => {
    return res.render('restaurants')
  }
}
module.exports = restController
