// https://github.com/yagop/node-telegram-bot-api/issues/319#issuecomment-324963294
// Fixes an error with Promise cancellation
process.env.NTBA_FIX_319 = "test";

require("dotenv").config();
// Require our Telegram helper package
const TelegramBot = require("node-telegram-bot-api");

/**
 *
 * @param {string} text
 */
async function handle_response(text) {
  if (text === "/start") {
    return "Hello, I am telegram bot. Try sending me some message.";
  } else if (text === "/help") {
    return "I am telegram bot. I can help you.";
  } else if (text == "/custom") {
    return "This is custom command";
  }

  text = text.toLowerCase().trim();
  if (text.includes("hello")) {
    return "Hey there";
  } else if (text.includes("how are you")) {
    return "I am good";
  } else if (text.includes("i love javascript")) {
    return "remember to subscribe";
  }
  return `✅ Thanks for your message: *"${text}"*\nHave a great day! 👋🏻`;
}
// Export as an asynchronous function
// We'll wait until we've responded to the user
module.exports = async (request, response) => {
  try {
    // Create our new bot handler with the token
    // that the Botfather gave us
    // Use an environment variable so we don't expose it in our code

    const bot = new TelegramBot(process.env.TELEGRAM_TOKEN);

    // Retrieve the POST request body that gets sent from Telegram
    const { body } = request;

    // Ensure that this is a message being sent
    if (body.message) {
      console.log(`message: ${body.message}`);
      // Retrieve the ID for this chat
      // and the text that the user sent
      /**
       * @type {{chat: any, text: string}}
       */
      let {
        message_id,
        chat: { id },
        text,
      } = body.message;
      let message;
      console.log(`type: ${body.message.chat.type}`);
      console.log(`text: ${text}`);
      if (
        body.message.chat.type === "group" ||
        body.message.chat.type === "supergroup"
      ) {
        console.log("checking group...");
        console.log(
          `text included: ${text.includes(process.env.BOT_USERNAME)}`
        );
        if (text.includes(process.env.BOT_USERNAME)) {
          text = text.replace(process.env.BOT_USERNAME, "").trim();
        } else {
          console.log("sending empty...");
          await bot.sendMessage(id, "", { parse_mode: "Markdown" });
        }
      }
      message = await handle_response(text);

      // Send our new message back in Markdown and
      // wait for the request to finish
      console.log(`respone_text: ${message}`);
      console.log("sending ...");
      await bot.sendMessage(id, message, { parse_mode: "Markdown" });
    }
  } catch (error) {
    // If there was an error sending our message then we
    // can log it into the Vercel console
    console.error("Error sending message");
    console.log(error.toString());
  }

  // Acknowledge the message with Telegram
  // by sending a 200 HTTP status code
  // The message here doesn't matter.
  console.log("respone: OK");
  response.send("OK");
};
