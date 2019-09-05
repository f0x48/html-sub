const cron = require('node-cron')
const fetch = require('node-fetch')
const db = require('./db.js')
const botd = require('./bot.js')

const createSchedule = exports.createSchedule = (m,h,cb) => {
  const fullString = `${m} */${h} * * *`
  cron.schedule(fullString, cb)
}

exports.initCronDb = () => db.getAllEntry().then(rows => {
  console.log(`Total Schedule : ${rows.length}`)
  rows.forEach(row => {
    const minute = row.id % 60
    createSchedule(minute,row.hourly, () => {
      fetch(row.url).then(async response => {
        const items = parser.getHashedItems(await response.text(), row.selector)
        console.log(`Request Made: id:${row.id}\nlast hash:${row.lastText}\ncurrent hash:${items.hash}\nurl:${row.url}`)
        if (items.hash != row.lastText) {
          botd.msg(row.chatid, row.title)
          db.updateHashDb(row.id, items.hash)
        }
      })
    })
  })
}).catch(err => {
  console.log('Error returning list from htmlSubData',err)
})