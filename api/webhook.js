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
function handle_response(text) {
  text = text.toLowerCase().trim();
  if (text.includes("hello")) {
    return "Hey there";
  } else if (text.includes("how are you")) {
    return "I am good";
  } else if (text.includes("I love Javascript")) {
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
      // Retrieve the ID for this chat
      // and the text that the user sent
      const {
        chat: { id },
        text,
      } = body.message;
      let message;
      if (text === "/start") {
        message = "Hello, I am telegram bot. Try sending me some message.";
      } else if (text === "/help") {
        message = "I am telegram bot. I can help you.";
      } else if (text == "/custom") {
        message = "This is custom command";
      } else {
        message = handle_response(text);
      }

      // Send our new message back in Markdown and
      // wait for the request to finish
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
  response.send("OK");
};
