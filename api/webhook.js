// https://github.com/yagop/node-telegram-bot-api/issues/319#issuecomment-324963294
// Fixes an error with Promise cancellation
process.env.NTBA_FIX_319 = 'test';

// Require out Telegram helper package
import TelegramBot from 'node-telegram-bot-api';
import costflow from 'costflow';
import { Octokit, App } from "octokit";

const config = {
  mode: 'beancount',
  currency: 'CNY',
  timezone: 'Asia/Shanghai',
  account: {
    银行卡: 'Assets:Bank:CCB:2225',
    现金: 'Assets:Cash',
    微信: 'Assets:Digital:WX',
    支付宝: 'Assets:Digital:ALIPAY',
    
    信用卡: 'Liabilities:CreditCard:CMB:7632',

    午饭: 'Expenses:Food:Daily:Lunch'
  },
};


// Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
const octokit = new Octokit({ auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN});


async function recordBillToGithub(output, text) {
  const response = await octokit.rest.repos.getContent({
    owner: "kba977",
    repo: "MyMoney",
    path: "2021/0-default/12-expenses.bean"
  });
  const { content: encodeContent, encoding, sha, path } = response.data;
  const content = Buffer.from(encodeContent, encoding).toString();

  await octokit.rest.repos.createOrUpdateFileContents({
    owner: "kba977",
    repo: "MyMoney",
    path: path,
    message: text,
    content: Buffer.from(`${content}${output}\n\n`).toString('base64'),
    sha: sha
  });
}

// Export as an asynchronous function
// We'll wait until we've responded to the user
module.exports = async (request, response) => {
  try {
    // Create our new bot handler with the token
    // that the Botfather gave us
    // Use an environment variable so we don't expose it in our code
    const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);

    // Retrieve the POST request body that gets sent from Telegram
    const { body } = request;

    // Ensure that this is a message being sent
    if (body.message) {
      // Retrieve the ID for this chat
      // and the text that the user sent
      const { chat: { id }, text, message_id } = body.message;

      try {
        // Create a costflow parsed message to send back
        const { output } = await costflow.parse(text, config);

        // Record to Github
        await recordBillToGithub(output, text)

        // Send our new message back in Markdown and
        // wait for the request to finish
        await bot.sendMessage(id, output, { reply_to_message_id: message_id });
      } catch (error) {
        await bot.sendMessage(id, error.message, { reply_to_message_id: message_id });
      }
    }
  } catch (error) {
    // If there was an error sending our message then we
    // can log it into the Vercel console
    console.error('Error sending message');
    console.log(error.toString());
  }

  // Acknowledge the message with Telegram
  // by sending a 200 HTTP status code
  // The message here doesn't matter.
  response.send('OK');
};