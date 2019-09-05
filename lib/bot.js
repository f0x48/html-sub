const parser = require('./parser-util.js')
const t = require('node-telegram-bot-api')
const fetch = require('node-fetch')
const db = require('./db.js')

const chatHistory = {}
const cmds = {
  askTitle: {
    regex: /\/new/,
    action: resp => {
      resp('Please create a title for this new htmlsubs, it will used as the message when content updated')
    }
  },
  askURL: {
    lastCmd: 'askTitle',
    action: (resp, mem, msg) => {
      mem.title = msg.text
      resp('Alrighty, title has been set!\nNow please insert the http request')
    }
  },
  askSelector: {
    lastCmd: 'askURL',
    action: (resp, mem, msg) => {
      mem.url = msg.text
      const time = new Date()
      let ms = 0;
      fetch(mem.url).then(async response => {
          ms = new Date() - time
          mem.resptext = await response.text()
          resp(`Very nice! the source was retreived in ${ms}ms!\nNow insert the document selector for the item that want to be subscribed`)
        })
        .catch(v => console.log(v))
    }
  },
  askTimeUpdate: {
    lastCmd: 'askSelector',
    action: (resp, mem, msg) => {
      mem.sel = msg.text.trim()
      const items = parser.getHashedItems(mem.resptext, mem.sel)
      const parseItems = items.items
        .map((text, i) => `${i+1}. ${text}`)
        .join('\n')
      mem.hash = items.hash
      resp(`Great! The selector has return ${items.items.length} items!.\n${parseItems}\nNow please choose how often htmlsub should make a request? (in hour)`)

    }
  },
  done: {
    lastCmd: 'askTimeUpdate',
    action: (resp, mem, msg) => {
      mem.time = msg.text
      resp(`Very Cool! HtmlSub will update every ${mem.time} hour and we will notify you when theres any change in the items!`)
      db.prpr.insertEntry.run(msg.chat.id, mem.title, mem.url, mem.sel, mem.time, mem.hash)
      mem = {}
    }
  }
}

function init(token) {
  const bot = new t(token, {
    polling: true
  })
  bot.on('message', msg => {
    const cid = msg.chat.id
    for (let cmdKey in cmds) {
      const cmd = cmds[cmdKey]
      if (chatHistory[cid] == undefined) chatHistory[cid] = {}
      const ch = chatHistory[cid]
      if (
        (ch && (ch.lastCmd == cmd.lastCmd)) ||
        (cmd.regex && cmd.regex.test(msg.text))
      ) {
        console.log(msg.text, cmdKey)
        cmd.action((textStr, ext = {}) => {
          bot.sendMessage(cid, textStr, ext)
        }, ch, msg)
        ch.lastCmd = cmdKey
        break;
      }
    }
  })
  exports.msg = bot.sendMessage
}

exports.msg
exports.init = init
exports.chatHistory = chatHistory
exports.commands = cmds