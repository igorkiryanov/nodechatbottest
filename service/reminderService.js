const remindersProvider = require('../data/providers/remindersMongooseProvider');
const errorHandlerService = require('../service/errorHandlerService');

const SNOOZE_TIME = 5000;
const showAllCommand = 'SHOW_ALL';
const deleteCommand = 'DELETE';
const createCommand = 'CREATE';
const snoozeCommand = 'SNOOZE';
const confirmCommand = 'CONFIRM';

async function init() {
  await remindersProvider.connect();
}

async function createReminder(userId, dateTime) {
  let retVal = null;
  try {
    retVal = await remindersProvider.createReminder(userId, dateTime);
  } catch (e) { errorHandlerService.handle(e); }
  return retVal;
}

async function deleteReminder(userId, dateTime) {
  let retVal = null;
  try {
    retVal = await remindersProvider.deleteReminder(userId, dateTime);
  } catch (e) { errorHandlerService.handle(e); }
  return retVal;
}

async function getReminders(userId, date) {
  let retVal = null;
  try {
    retVal = await remindersProvider.getReminders(userId, date);
    const oldReminderIds = [];
    for (let i = 0; i < retVal.length;) {
      const reminder = retVal[i];
      if (reminder.dateTime < Date.now()) {
        oldReminderIds.push(reminder.id);
        retVal.splice(i, 1);
      } else { i += 1; }
    }
    remindersProvider.deleteReminders(oldReminderIds);

    retVal = retVal.join('\n');
  } catch (e) { errorHandlerService.handle(e); }
  return retVal;
}

async function confirmReminder(userId, dateTime) {
  let retVal = null;
  try {
    retVal = await deleteReminder(userId, dateTime);
  } catch (e) { errorHandlerService.handle(e); }
  return retVal;
}

async function snoozeReminder(userId, dateTime) {
  await deleteReminder(userId, dateTime);
  await createReminder(userId, dateTime + SNOOZE_TIME);
}

const commandEvents = {};
commandEvents[showAllCommand] = getReminders;
commandEvents[createCommand] = createReminder;
commandEvents[deleteCommand] = deleteReminder;
commandEvents[snoozeCommand] = snoozeReminder;
commandEvents[confirmCommand] = confirmReminder;

async function runCommand(command, userId, dateTime) {
  let retVal = null;
  try {
    if (commandEvents[command]) {
      retVal = await commandEvents[command](userId, dateTime);
    }
  } catch (e) { errorHandlerService.handle(e); }
  return retVal;
}

module.exports = {
  createReminder,
  deleteReminder,
  getReminders,
  confirmReminder,
  snoozeReminder,
  runCommand,
  init,
  commands: {
    showAllCommand,
    deleteCommand,
    createCommand,
    snoozeCommand,
    confirmCommand,
  },
};
