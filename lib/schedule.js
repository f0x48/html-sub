const cron = require('node-cron')
const fetch = require('node-fetch')
const db = require('./db.js')
const botd = require('./bot.js')
const parser = require('./parser-util')

const createSchedule = exports.createSchedule = row => {
  const fullString = `${row.id % 60} */${row.hourly} * * *`
  cron.schedule(fullString, () => checkContent(row))
  console.log(`Schedule created ${fullString}`)
}

function checkContent(row) {
  fetch(row.req).then(async response => {
    const items = parser.getHashedItems(await response.text(), row.selector)
    console.log(`\nRequest Made:\nid:${row.id}\nlast hash:${row.lastText}\ncurrent hash:${items.hash}\nurl:${row.req}`)
    if (items.hash != row.lastText) {
      botd.bot.sendMessage(row.chatid, `${row.title}\n${row.req}`)
      db.updateHashDb(row.id, items.hash)
    }
    else {
      botd.bot.sendMessage(row.chatid, `[no update] ${row.title}`)
    }
  })
}

exports.initCronDb = () => db.getAllEntry().then(rows => {
  console.log(`Total Schedule : ${rows.length}`)
  rows.forEach(row => createSchedule(row))
}).catch(err => {
  console.log('Error returning list from htmlSubData',err)
})


exports.checkContent = checkContent