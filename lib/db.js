const sqlite = require('sqlite3')
const schedule = require('./schedule.js')

let db;
let prpr;

function init(path,cb) {
  console.log('Initializing Database')
  db = new sqlite.Database(path)
  db.run(`CREATE TABLE IF NOT EXISTS "htmlSubData" (
    "id"    INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
    "chatid"        TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "req"   TEXT NOT NULL,
    "selector"      TEXT NOT NULL,
    "hourly"        INTEGER NOT NULL,
    "lastText"      TEXT
);`, err => {
    if (err) return
    console.log('Database Initialized')
    prpr = exports.prpr = {
      insertEntry: db.prepare("INSERT INTO 'htmlSubData' VALUES (NULL,?,?,?,?,?,?)"),
      updateLastValueHash: db.prepare('UPDATE htmlSubData SET lastText=? WHERE id=?')
    }
    exports.db = db
    cb()
  })

}

exports.init = init

exports.updateHashDb = (id, hash) => {
  prpr.updateLastValueHash.run(hash, id)
}
exports.insertEntry = (...a) => {
  prpr.insertEntry.run(...a, function () {
    console.log(this)
    const row = {
      id: this.lastID,
      chatid: a[0],
      title: a[1],
      req: a[2],
      selector: a[3],
      hourly: a[4],
      lastText: a[5]
    }
    schedule.createSchedule(row)
  })
}
exports.getAllEntry = () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM htmlSubData", (err, rows) => {
      if (err) reject(err)
      else resolve(rows)
    })
  })
}