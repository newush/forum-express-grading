const express = require('express')
const handlebars = require('express-handlebars')
const db = require('./models') // 引入資料庫
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const app = express()
const port = 3000

app.engine('handlebars', handlebars({ defaultLayout: 'main' })) //新增樣板引擎
app.set('view engine', 'handlebars') //使用樣板引擎
app.use(bodyParser.urlencoded({ extended: true }))
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
// setup session and flash
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(flash())
// 把 req.flash 放到 res.locals 裡面
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  next()
})

// 引入 routes 並將 app 傳進去，讓 routes 可以用 app 這個物件來指定路由
require('./routes')(app)

module.exports = app
