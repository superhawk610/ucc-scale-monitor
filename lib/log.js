const chalk = require('chalk')

const colors = ['green', 'yellow', 'blue']
const tags = []

const colorize = (tag, text) => {
  if (tags.indexOf(tag) == -1) tags.push(tag)
  return chalk.keyword(colors[tags.indexOf(tag) % colors.length])(text)
}

module.exports = (tag, message) => {
  tag = tag.toUpperCase().substring(0, 6)
  const space = '      '.substring(0, 6 - tag.length)
  console.log(`${space}${colorize(tag, `[${tag.substring(0, 6)}]`)} ${message}`)
}
