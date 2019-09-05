const jsdom = require('jsdom').JSDOM
const md5 = require('./md5')

function getHashedItems(html, selector) {
  console.log(html)
  const dom = (new jsdom(html)).window.document
  const items = [...dom.querySelectorAll(selector)]
    .map((ele) => ele.textContent)
  console.log(items)
  return {
    items,
    get hash() {
      return md5(items.join(''))
    }
  }
}

exports.getHashedItems = getHashedItems