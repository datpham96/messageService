var moment = require('moment')

module.exports = function timestamp(schema) {
  schema.add({
    createdAt: String,
    updatedAt: String
  })
  schema.pre('save', function (next) {
    let now = moment().format('YYYY-MM-DD HH:mm:ss')
    this.updatedAt = now
    if (!this.createdAt) {
      this.createdAt = now
    }
    next()
  })
}