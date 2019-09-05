const sch = require('../lib/schedule')
const db = require('../lib/db.js')
const bot = require('../lib/bot.js')
bot.init(require('fs').readFileSync('token.txt','utf8').trim())
db.init(__dirname+"/../db.db")
db.db.each("SELECT * FROM htmlSubData LIMIT 1",(err,row) => {
  sch.checkContent(row)
})