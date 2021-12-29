const accounts = {
      // Assets
    银行卡: 'Assets:Bank:CMB:6371',
    现金: 'Assets:Cash',
    微信: 'Assets:Digital:WX',
    支付宝: 'Assets:Digital:ALIPAY',
    京馆涮: 'Assets:PrepaidCard:Restaurant:JGS',
    公交卡: 'Assets:PrepaidCard:BusCard:XA',

    // Liabilities
    信用卡: 'Liabilities:CreditCard:CMB:5483',

    // Expenses
    
    话费: 'Expenses:Home:Phone',
    水电燃气 : 'Expenses:Home:SDRQ',
    理发费: 'Expenses:Home:Haircut',

    /// 人情
    父母: 'Expenses:Relationship:FilialPiety',
    
    /// 购物
    电子产品: 'Expenses:Shopping:Digital',
    
    /// 餐饮
    早餐: 'Expenses:Food:Daily:Breakfast',
    午餐: 'Expenses:Food:Daily:Lunch',
    晚餐: 'Expenses:Food:Daily:Dinner',
    饮料水果: 'Expenses:Food:Daily:DrinkFruit',
    买菜: 'Expenses:Food:Vegetables',
    零食: 'Expenses:Food:Snacks',
    大餐: 'Expenses:Food:BigMeal',


    /// 医疗健康
    门诊: 'Expenses:Health:Outpatient',
    药品: 'Expenses:Health:Medical',

    /// 娱乐
    电影: 'Expenses:Entertainment:Movie',

    /// 交通
    共享单车: 'Expenses:Transport:OFO',
    公交: 'Expenses:Transport:GJDT',
    地铁: 'Expenses:Transport:GJDT',

    /// 投资
    开发: 'Expenses:Invest:Dev',
    学习: 'Expenses:Invest:Study',
    手续费: 'Expenses:Invest:Cost',

    /// 其他
    其他: 'Expenses:Other'
}


function accounts_str() {
  account_arr = []
  for (const [key, value] of Object.entries(accounts)) {
    var account = `- ${key} ${value}`
    account_arr.push(account)
  }
  return account_arr.join("\n")
}


module.exports = {
  accounts: accounts,
  accounts_str: accounts_str
}