// https://github.com/yagop/node-telegram-bot-api/issues/319#issuecomment-324963294
// Fixes an error with Promise cancellation
process.env.NTBA_FIX_319 = 'test';

// Require out Telegram helper package
const TelegramBot = require('node-telegram-bot-api');
const { recordBillToGithub } = require('../utils/github');
const { parse } = require('../utils/parser');
const { accounts_str } = require('../utils/accounts');

const bot_id = process.env.BOT_ID;
const GITHUB_REPO = process.env.GITHUB_REPO || 'kba977/MyMoney';
const GITHUB_WORKFLOW = process.env.GITHUB_WORKFLOW || 'query.yml';
const GITHUB_TOKEN = process.env.GITHUB_ACTION_ACCESS_TOKEN;

// Function to trigger GitHub Action for queries
async function triggerGitHubAction(query) {
  const url = `https://api.github.com/repos/${GITHUB_REPO}/actions/workflows/${GITHUB_WORKFLOW}/dispatches`;
  const payload = JSON.stringify({
    ref: "main",
    inputs: {
      query: query,
    }
  });

  const options = {
    method: "POST",
    headers: {
      "Authorization": `token ${GITHUB_TOKEN}`,
      "Accept": "application/vnd.github.v3+json",
      "Content-Type": "application/json"
    },
    body: payload
  };

  try {
    const response = await fetch(url, options);
    return response.status === 204 ? "查询已触发，请稍等..." : `触发失败：${response.statusText}`;
  } catch (error) {
    return `触发失败：${error.message}`;
  }
}

// Define query commands and their corresponding SQL queries
const QUERY_COMMANDS = {
  '/query_accounts': null, // Special case, uses accounts_str()
  '/query_networth_bank': 'SELECT sum(position) as net_worth WHERE account ~ "^Assets:Bank" OR account ~ "^Liabilities"',
  '/query_networth_investment': 'SELECT CONVERT(sum(position), "CNY") as net_worth WHERE account ~ "^Assets:Investment"'
};

// Handle query commands
async function handleQueryCommand(bot, chatId, messageId, command) {
  if (command === '/query_accounts') {
    return bot.sendMessage(chatId, accounts_str(), { 
      reply_to_message_id: messageId, 
      parse_mode: 'Markdown' 
    });
  } else if (QUERY_COMMANDS[command]) {
    const result = await triggerGitHubAction(QUERY_COMMANDS[command]);
    return bot.sendMessage(chatId, result, {
      reply_to_message_id: messageId,
      parse_mode: 'Markdown'
    });
  }
  return null;
}

// Export as an asynchronous function
// We'll wait until we've responded to the user
module.exports = async (request, response) => {

  if (request.method === 'GET') {
    response.send("I'm alive!");
    return
  }

  // Create our new bot handler with the token that the Botfather gave us. Use an environment variable,
  // so we don't expose it in our code
  const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);

  // Retrieve the POST request body that gets sent from Telegram
  const { message } = request.body;

  // Ensure that this is a message being sent
  if (message) {
    // Retrieve the ID for this chat and the text that the user sent
    const { chat: { id, first_name }, text, message_id } = message;

    if (id == bot_id) {
      // Check if the message is a query command
      if (Object.keys(QUERY_COMMANDS).includes(text)) {
        await handleQueryCommand(bot, id, message_id, text);
      }
      // Check the message send to telegram is valid format
      else if (!text.match(/^@.*?\s>\s.+/)) {
        await bot.sendMessage(id, "*Error Format:*\neg: `@魏家便利店 卤肉饭 20 信用卡 > 午餐`", {
          reply_to_message_id: message_id,
          parse_mode: 'Markdown'
        });
      } else {
        try {
          // Create a costflow parsed message to send back
          const { output } = await parse(text);
          // Record to Github
          await recordBillToGithub(output, text)
          // Send our new message back and wait for the request to finish
          await bot.sendMessage(id, output, { reply_to_message_id: message_id });
        } catch (error) {
          await bot.sendMessage(id, error.message, { reply_to_message_id: message_id });
        }
      }
    } else {
      await bot.sendMessage(id, '对不起, 该机器人为私人机器人, 您无权使用', { reply_to_message_id: message_id });
      await bot.sendMessage(bot_id, `主人主人!!, 发现匿名用户使用, username: ${first_name}, message: ${text}`);
    }
  }

  // Acknowledge the message with Telegram by sending a 200 HTTP status code, the message here doesn't matter.
  response.send('OK');
};