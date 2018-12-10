const BootBot = require('bootbot');
// const chrono = require('chrono-node');
const persistentMenu = require('../modules/facebook/persistentMenu');
const nlpService = require('../service/nlpService');
const reminderService = require('../service/reminderService');
// const schedule = require('node-schedule');
require('dotenv').config();

const bot = new BootBot({
  accessToken: process.env.FB_ACCESS_TOKEN,
  verifyToken: process.env.FB_VERIFY_TOKEN,
  appSecret: process.env.FB_APP_SECRET,
});

bot.setGreetingText("Hello, I'm here to help you manage your tasks. Be sure to setup your bucket by typing 'Setup'. ");

bot.setGetStartedButton((payload, chat) => {
  chat.say('Hello my name is Node Chatbot Test and I can create a reminders for you!');
});

bot.module(persistentMenu);

bot.on('message', (payload, chat, data) => {
  if (payload.message && payload.message.quick_reply) {
    return;
  }
  nlpService.handleMessage(payload, chat, data, (err, nlpResults) => {
    if (err) {
      chat.say(`Sorry, error with NLP service:\n${err}`);
      return;
    }
    reminderService.handleIntents(nlpResults, (rErr, reminderResult) => {
      if (rErr) {
        chat.say(`Sorry, error with reminder service:\n${rErr}`);
        return;
      }
      chat.say(JSON.stringify(reminderResult));
    });
  });
});

function start() {
  bot.start();
}

module.exports = { start };
