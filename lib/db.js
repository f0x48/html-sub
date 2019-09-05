const sqlite = require('sqlite3')
const db = new sqlite.Database('db.db')


function init() {
  console.log('Initializing Database')
  db.run(`CREATE TABLE IF NOT EXISTS "htmlSubData" (
    "chatid"	TEXT NOT NULL UNIQUE,
    "title"	TEXT NOT NULL,
    "req"	TEXT NOT NULL,
    "selector"	TEXT NOT NULL,
    "hourly"	INTEGER NOT NULL,
    "lastText"	TEXT,
    PRIMARY KEY("chatid")
  );`,err => {
    if(!err) console.log('Database Initialized')
  })
}

exports.init = init
exports.prpr = {
  insertEntry : db.prepare("INSERT INTO 'htmlSubData' VALUES (NULL,?,?,?,?,?,?)"),
  updateLastValueHash: db.prepare('UPDATE htmlSubData SET lastText=? WHERE id=?')
}

exports.updateHashDb = (id,hash) =>  prpr.updateLastValueHash(hash,id)
exports.getAllEntry = () => {
  return new Promise((resolve,reject) => {
    db.all("SELECT * FROM htmlSubData",(err,rows) => {
      if(err) reject(err)
      else resolve(rows)
    })
  })
}


