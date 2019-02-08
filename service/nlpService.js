const nlpProvider = require('../api/nlp/nlpLUISProvider');
const reminderService = require('../service/reminderService');
const errorHandlerService = require('../service/errorHandlerService');

const intentsCommands = {};
intentsCommands.ShowReminders = reminderService.commands.showAllCommand;
intentsCommands.CreateReminder = reminderService.commands.createCommand;
intentsCommands.DeleteReminder = reminderService.commands.deleteCommand;
intentsCommands.SnoozeReminder = reminderService.commands.snoozeCommand;
intentsCommands.ConfirmReminder = reminderService.commands.confirmCommand;

async function handleMessage(payload, chat, data) {
  try {
    await nlpProvider.init();
  } catch (e) {
    errorHandlerService.handle(e);
  }
  return nlpProvider.handleMessage(payload, chat, data);
}

async function init() {
  let retVal = null;
  try {
    retVal = await nlpProvider.init();
  } catch (e) {
    errorHandlerService.handle(e);
  }
  return retVal;
}

module.exports = { handleMessage, init, intentsCommands };
