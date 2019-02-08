const mongoose = require('mongoose');
const Reminder = require('../../data/models/reminderMongooseModel');
const ReminderPresentation = require('../../service/models/reminder');
const constants = require('../../service/resources/textConstants');
const errorHandlerService = require('../../service/errorHandlerService');
require('dotenv').config();

function getPresentation(dataReminder) {
  // eslint-disable-next-line no-underscore-dangle
  return new ReminderPresentation(dataReminder._id, dataReminder.dateTime);
}

async function connect() {
  return mongoose.connect(`mongodb://${process.env.MONGO_ATLAS_USR}:${process.env.MONGO_ATLAS_PWD}@nodechatbottest-shard-00-00-s4bul.azure.mongodb.net:27017,nodechatbottest-shard-00-01-s4bul.azure.mongodb.net:27017,nodechatbottest-shard-00-02-s4bul.azure.mongodb.net:27017/test?ssl=true&replicaSet=NodeChatbotTest-shard-0&authSource=admin&retryWrites=true`, { useNewUrlParser: true });
}

async function createReminder(userId, dateTime) {
  const reminder = new Reminder({
    _id: new mongoose.Types.ObjectId(),
    userId,
    dateTime,
  });
  let retVal = null;
  try {
    retVal = await reminder.save();
  } catch (e) {
    errorHandlerService.handle(e);
  }
  return retVal;
}

async function deleteReminders(remindersIds) {
  const retVal = await Reminder.deleteMany({ _id: { $in: remindersIds } });
  return retVal;
}

async function getReminders(userId, dateTime) {
  let reminderQuery = Reminder.find()
    .where('userId').equals(mongoose.Types.Long.fromString(userId));
  if (dateTime) {
    reminderQuery = reminderQuery.where('dateTime').equals(dateTime);
  }
  const items = [];
  try {
    const result = await reminderQuery.exec();
    result.forEach((dataReminder) => {
      items.push(getPresentation(dataReminder));
    });
    items.sort(ReminderPresentation.compare);
  } catch (e) {
    errorHandlerService.handle(e);
  }
  return items;
}

async function deleteReminder(userId, dateTime) {
  const result = await getReminders(userId, dateTime);
  if (!result || result.length === 0) {
    errorHandlerService.handle(new Error(constants.reminderNotFoundErrorText));
  }
  const reminderIds = [];
  result.forEach((reminder) => {
    reminderIds.push(reminder.id);
  });
  let removeResult = null;
  try {
    removeResult = await deleteReminders(reminderIds);
  } catch (e) {
    errorHandlerService.handle(e);
  }
  return removeResult;
}

module.exports = {
  createReminder,
  deleteReminder,
  deleteReminders,
  getReminders,
  connect,
};
