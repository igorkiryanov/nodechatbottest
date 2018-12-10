const chrono = require('chrono-node');
const reminderService = require('../../service/reminderService');

const disableInput = false;
let askReminderDateTime = null;

function reaskReminderDateTime(text, convo) {
  convo.ask(
    {
      text,
      quickReplies: ['cancel'],
    },
    askReminderDateTime,
    [{
      event: 'quick_reply',
      callback: () => {
        convo.end();
      },
    }],
  );
}

askReminderDateTime = (payload, convo, callback) => {
  const message = payload.message.text;
  const dateTime = chrono.parseDate(message);
  if (dateTime) {
    if (new Date() > dateTime) {
      reaskReminderDateTime(`I'm sorry, '${dateTime.toLocaleString()}' is already past! Please, try again or cancel`, convo);
    } else {
      if (callback) callback(dateTime);
      convo.say(`Reminder for ${dateTime.toLocaleString()} successfully set!`);
      convo.end();
    }
  } else {
    reaskReminderDateTime(`I'm sorry, I can't understand '${message}'! Please, try again or cancel`, convo);
  }
};

function askCreateReminder(convo) {
  convo.ask('Please provide date and time for reminder', (payload, cConvo) => {
    askReminderDateTime(payload, cConvo, (dateTime) => {
      reminderService.createReminder(payload.sender.id, dateTime);
    });
  });
}

function askDeleteReminder(convo) {
  convo.ask('Please provide date and time for reminder', (payload, cConvo) => {
    askReminderDateTime(payload, cConvo, (dateTime) => {
      reminderService.deleteReminder(payload.sender.id, dateTime);
    });
  });
}

module.exports = (bot) => {
  bot.setPersistentMenu([
    {
      title: 'Create reminder',
      type: 'postback',
      payload: 'REMINDER_CREATE',
    },
    {
      title: 'Show all reminders',
      type: 'postback',
      payload: 'REMINDER_SHOWALL',
    },
    {
      title: 'Delete reminder',
      type: 'postback',
      payload: 'REMINDER_DELETE',
    },
  ], disableInput);

  bot.on('postback:REMINDER_CREATE', (payload, chat) => {
    chat.conversation((convo) => {
      askCreateReminder(convo);
    });
  });

  bot.on('postback:REMINDER_DELETE', (payload, chat) => {
    chat.conversation((convo) => {
      askDeleteReminder(convo);
    });
  });

  bot.on('postback:REMINDER_SHOWALL', (payload, chat) => {
    reminderService.getReminders(payload.recipient.id, null, (err, result) => {
      if (err) {
        chat.say(`Sorry, error with getting all reminders:\n${err}`);
      }
      chat.say(`Reminders list:\n${result}`);
    });
  });

  bot.on('postback:REMINDER_SHOWTODAY', (payload, chat) => {
    const today = new Date();
    reminderService.getReminders(payload.recipient.id, today, (err, result) => {
      if (err) {
        chat.say(`Sorry, error with getting reminders for today:\n${err}`);
      }
      chat.say(`Reminders for ${today.toLocaleDateString()}:\n${JSON.stringify(result)}`);
    });
  });
};
