// https://github.com/yagop/node-telegram-bot-api/issues/319#issuecomment-324963294
// Fixes an error with Promise cancellation
process.env.NTBA_FIX_319 = 'test';

// Require out Telegram helper package
import TelegramBot from 'node-telegram-bot-api';
import { recordBillToGithub } from '../utils/github'
import { parse } from '../utils/parser'

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
  const { message } = request.body ;

  // Ensure that this is a message being sent
  if (message) {
    // Retrieve the ID for this chat and the text that the user sent
    const { chat: { id }, text, message_id } = message;

    // Check the message send to telegram is valid format
    if (!text.match(/^@.*?\s>\s.+/)) {
      await bot.sendMessage(id, "*Error Format:*\neg: `@魏家便利店 卤肉饭 20 xyk > lunch`", {
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
  }

  // Acknowledge the message with Telegram by sending a 200 HTTP status code, the message here doesn't matter.
  response.send('OK');
};