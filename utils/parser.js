const costflow = require("costflow").default;
const { accounts } = require('./accounts');

const config = {
  mode: 'beancount',
  currency: 'CNY',
  timezone: 'Asia/Shanghai',
  account: accounts
};

module.exports.parse = async function parse(text) {
  return await costflow.parse(text, config);
}