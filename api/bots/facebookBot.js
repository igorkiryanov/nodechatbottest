const BootBot = require('bootbot');
const nlpService = require('../../service/nlpService');
const reminderService = require('../../service/reminderService');
const reminderModule = require('./modules/facebook/reminder');
const errorHandlerService = require('../../service/errorHandlerService');
// const chrono = require('chrono-node');
// const schedule = require('node-schedule');
require('dotenv').config();

const bot = new BootBot({
  accessToken: process.env.FB_ACCESS_TOKEN,
  verifyToken: process.env.FB_VERIFY_TOKEN,
  appSecret: process.env.FB_APP_SECRET,
});

bot.module(reminderModule);

async function start() {
  try {
    await nlpService.init();
    await reminderService.init();
  } catch (e) {
    errorHandlerService.handle(e);
  }
  bot.start(process.env.LOCAL_PORT);
}

module.exports = { start };
