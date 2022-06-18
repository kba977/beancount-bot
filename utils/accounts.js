const accounts = {
      // Assets
    银行卡: 'Assets:Bank:ZCM:CMB:6371',
    现金: 'Assets:Cash:ZCM',
    微信: 'Assets:Digital:ZCM:WX',
    支付宝: 'Assets:Digital:ZCM:ALIPAY',

    // Liabilities
    信用卡: 'Liabilities:CreditCard:ZCM:CMB:5483',

    // Expenses
    
    话费: 'Expenses:Home:Phone',
    水电燃气 : 'Expenses:Home:SDRQ',
    理发: 'Expenses:Home:Haircut',

    小宝医疗: 'Expenses:Child:Medical',
    小宝日常: 'Expenses:Child:Other',
    小宝衣服: 'Expenses:Child:Clothing',
    小宝疫苗: 'Expenses:Child:Vaccine',
    纸尿裤: 'Expenses:Child:Diaper',
    奶粉: 'Expenses:Child:MilkPowder',

    /// 人情
    父母: 'Expenses:Relationship:FilialPiety',
    
    /// 购物
    电子产品: 'Expenses:Shopping:Digital',
    购物: 'Expenses:Shopping:Other',
    
    /// 餐饮
    早餐: 'Expenses:Food:Daily:Breakfast',
    午餐: 'Expenses:Food:Daily:Lunch',
    晚餐: 'Expenses:Food:Daily:Dinner',
    饮料: 'Expenses:Food:Daily:DrinkFruit',
    水果: 'Expenses:Food:Daily:DrinkFruit',
    买菜: 'Expenses:Food:Vegetables',
    零食: 'Expenses:Food:Snacks',
    大餐: 'Expenses:Food:BigMeal',


    /// 医疗健康
    门诊: 'Expenses:Health:Outpatient',
    药品: 'Expenses:Health:Medical',

    /// 娱乐
    电影: 'Expenses:Entertainment:Movie',
    娱乐: 'Expenses:Entertainment:Other',
    游戏: 'Expenses:Entertainment:Game',
    流媒体: 'Expenses:Entertainment:Media',

    /// 交通
    单车: 'Expenses:Transport:OFO',
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