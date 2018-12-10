const BootBot = require('bootbot');
const chrono = require('chrono-node');
const persistentMenu = require('../modules/facebookBotPersistentMenu');
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
  const messageText = payload.message.text;
  if (data.captured) { return; }
  chat.say(`Echo: ${messageText}`);
});

bot.hear(['hello', 'hey', 'sup'], (payload, chat) => {
  chat.getUserProfile().then((user) => {
    chat.say(`Hey ${user.first_name}, How are you today?`);
  });
});

bot.hear('create', (payload, chat) => {
  chat.conversation((convo) => {
    convo.ask("What would you like your reminder to be? etc 'I have an appointment tomorrow from 10 to 11 AM' the information will be added automatically", (cPayload/* , cConvo */) => { // 1
      const datetime = chrono.parseDate(cPayload.message.text); // 2
      const params = {
        write_key: '111', // config.bucket.write_key,
        type_slug: 'reminders',
        title: cPayload.message.text,
        metafields: [
          {
            key: 'date',
            type: 'text',
            value: datetime,
          },
        ],
      }; // 3
      console.log(JSON.stringify(params));
      /*
      Cosmic.addObject(config, params, (error, response) => { // 4
        if (!error) {
          eventEmitter.emit('new', response.object.slug, datetime); // 5
          cConvo.say('reminder added correctly :)');
          cConvo.end();
        } else {
          cConvo.say('there seems to be a problem. . .');
          cConvo.end();
        }
      });
      */
    });
  });
});

function start() {
  bot.start();
}

module.exports = { start };
