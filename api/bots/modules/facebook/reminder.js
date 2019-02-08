const chrono = require('chrono-node');
const nlpService = require('../../../../service/nlpService');
const reminderService = require('../../../../service/reminderService');
const constants = require('../../../../service/resources/textConstants');

const disableInput = false;
const CONVERSATION_TYPING_INDICATOR_INTERVAL = 1000;

let handleReminderDateTime = null;
function reaskReminderDateTime(text, convo) {
  return new Promise((resolve, reject) => {
    convo.ask(
      {
        text,
        quickReplies: ['cancel'],
      },
      (payload, aConvo) => {
        handleReminderDateTime(payload, aConvo)
          .then(result => resolve(result))
          .catch(err => reject(err));
      },
      [{
        event: 'quick_reply',
        callback: () => {
          convo.end();
        },
      }],
    );
  });
}

handleReminderDateTime = (payload, convo) => new Promise(async (resolve, reject) => {
  const message = payload.message.text;
  const dateTime = chrono.parseDate(message);
  const ignoreCheck = convo.get('ignoreCheck');
  if (dateTime) {
    if (new Date() > dateTime && !ignoreCheck) {
      reaskReminderDateTime(constants.datePastErrorText(dateTime.toLocaleString()), convo)
        .then(resolve)
        .catch(reject);
    } else {
      try {
        const existReminders = await reminderService.getReminders(payload.sender.id, dateTime);
        if (!ignoreCheck && existReminders && existReminders.length > 0) {
          reaskReminderDateTime(constants.reminderAlreadyExistsErrorText(dateTime.toLocaleString()),
            convo)
            .then(resolve)
            .catch(reject);
        } else {
          resolve(dateTime);
        }
      } catch (e) { reject(e); }
    }
  } else {
    reaskReminderDateTime(constants.cantUnderstandMessageErrorText(message), convo)
      .then(resolve)
      .catch(reject);
  }
});

function askReminderDateTime(convo, ignoreCheck) {
  convo.sendTypingIndicator(CONVERSATION_TYPING_INDICATOR_INTERVAL);
  return new Promise((resolve, reject) => {
    convo.set('ignoreCheck', ignoreCheck);
    convo.ask(constants.provideReminderDateTimeText, (payload, cConvo) => {
      convo.sendTypingIndicator(CONVERSATION_TYPING_INDICATOR_INTERVAL);
      handleReminderDateTime(payload, cConvo)
        .then(result => resolve({ senderId: payload.sender.id, dateTime: result }))
        .catch(err => reject(err));
    });
  });
}

async function askCreateReminder(convo) {
  try {
    const result = await askReminderDateTime(convo);
    const dateResult = await reminderService.createReminder(result.senderId, result.dateTime);
    convo.say(constants.reminderSuccessfullySetText(dateResult.dateTime.toLocaleString()));
    convo.end();
  } catch (err) {
    convo.say(constants.saveReminderErrorText(err));
    convo.end();
  }
}

async function askDeleteReminder(convo) {
  try {
    const result = await askReminderDateTime(convo, true);
    await reminderService.deleteReminder(result.senderId, result.dateTime);
    convo.say(constants.reminderSuccessfullyDeletedText(result.dateTime.toLocaleString()));
    convo.end();
  } catch (err) {
    convo.say(constants.deleteReminderErrorText(err));
    convo.end();
  }
}

function createReminderMenuOption(payload, chat) {
  chat.conversation((convo) => {
    askCreateReminder(convo);
  });
}

function deleteReminderMenuOption(payload, chat) {
  chat.conversation((convo) => {
    askDeleteReminder(convo);
  });
}

async function getRemindersMenuOption(payload, chat) {
  try {
    chat.sendTypingIndicator(CONVERSATION_TYPING_INDICATOR_INTERVAL);
    const result = await reminderService.getReminders(payload.sender.id, null);
    if (result && result.length > 0) {
      chat.say(constants.remindersListText(result));
    } else {
      chat.say(constants.remindersListEmptyText);
    }
  } catch (err) {
    chat.say(constants.getRemindersErrorText(err));
  }
  /* {
    "template_type": "list",
    "top_element_style": "compact",
    elements: [
      { title: 'Artile 1', image_url: '/path/to/image1.png', default_action: {}, buttons: [
        { type: 'postback', title: 'Cancel', payload: 'CANCEL' }
      ] },
        { title: 'Artile 2', image_url: '/path/to/image2.png', default_action: {}, buttons: [
        { type: 'postback', title: 'Cancel', payload: 'CANCEL' }
      ] }
    ],
  } */
}

module.exports = (bot) => {
  bot.setGreetingText(constants.greetingsText);

  bot.setGetStartedButton((payload, chat) => {
    chat.say(constants.startButtonText);
  });

  const persistentMenuOptions = [
    {
      title: 'Create reminder',
      type: 'postback',
      payload: 'REMINDER_CREATE',
      event: createReminderMenuOption,
    },
    {
      title: 'Show all reminders',
      type: 'postback',
      payload: 'REMINDER_SHOWALL',
      event: getRemindersMenuOption,
    },
    {
      title: 'Delete reminder',
      type: 'postback',
      payload: 'REMINDER_DELETE',
      event: deleteReminderMenuOption,
    },
  ];

  bot.setPersistentMenu(persistentMenuOptions, disableInput);

  persistentMenuOptions.forEach((option) => {
    bot.on(`${option.type}:${option.payload}`, option.event);
  });

  bot.on('message', (payload, chat, data) => {
    if (payload.message && payload.message.quick_reply) {
      return;
    }
    nlpService.handleMessage(payload, chat, data)
      .then(async (result) => {
        try {
          const rResult = await reminderService.runCommand(nlpService.intentsCommands[result]);
          chat.say(JSON.stringify(rResult));
        } catch (rErr) {
          chat.say(constants.reminderServiceErrorText(rErr));
        }
      })
      .catch(err => chat.say(constants.nlpServiceErrorText(err)));
  });
};
