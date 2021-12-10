import costflow from 'costflow';

const config = {
  mode: 'beancount',
  currency: 'CNY',
  timezone: 'Asia/Shanghai',
  account: {
    yhk: 'Assets:Bank:CMB:6371',
    cash: 'Assets:Cash',
    wx: 'Assets:Digital:WX',
    zfb: 'Assets:Digital:ALIPAY',
    jgs: 'Assets:PrepaidCard:Restaurant:JGS',

    xyk: 'Liabilities:CreditCard:CMB:7632',

    lunch: 'Expenses:Food:Daily:Lunch',
    ofo: 'Expenses:Transport:OFO'
  },
};

module.exports.parse = async function parse(text) {
  return await costflow.parse(text, config);
}