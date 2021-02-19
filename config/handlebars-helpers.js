const moment = require('moment')

module.exports = {
  ifCond: function (a, b, options) {
    if (a === b) {
      return options.fn(this)
    }
    return options.inverse(this)
  },
  moment: function (a) {
    return moment(a).fromNow()
  },
  each_upto: function (ary, max, options) {
    if (!ary || ary.length === 0)
      return options.inverse(this)
    var result = []
    for (let i = 0; i < max && i < ary.length; i++)
      result.push(options.fn(ary[i]))
    return result.join('')
  }
}