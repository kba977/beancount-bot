// https://github.com/yagop/node-telegram-bot-api/issues/319#issuecomment-324963294
// Fixes an error with Promise cancellation
process.env.NTBA_FIX_319 = 'test';

// Require out Telegram helper package
const TelegramBot = require('node-telegram-bot-api');
const { recordBillToGithub } = require('../utils/github');
const { parse } = require('../utils/parser');
const { accounts, accounts_str } = require('../utils/accounts');

const my_id = 428455027;

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

    if (id == my_id) {
      if (text == '/accounts') {
        await bot.sendMessage(id, accounts_str(), { 
          reply_to_message_id: message_id, 
          parse_mode: 'Markdown' 
        });
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
      await bot.sendMessage(my_id, `主人主人!!, 发现匿名用户使用, username: ${first_name}, message: ${text}`);
    }
  }

  // Acknowledge the message with Telegram by sending a 200 HTTP status code, the message here doesn't matter.
  response.send('OK');
};