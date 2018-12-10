const remindersProvider = require('../data/providers/remindersMongooseProvider');

const SNOOZE_TIME = 5000;

function createReminder(userId, dateTime) {
  return remindersProvider.createReminder(userId, dateTime);
}

function deleteReminder(userId, dateTime) {
  return remindersProvider.deleteReminder(userId, dateTime);
}

function getReminders(userId, date, callback) {
  remindersProvider.getReminders(userId, date, (err, result) => {
    callback(err, result.join('\n'));
  });
}

function confirmReminder(userId, dateTime) {
  return deleteReminder(userId, dateTime);
}

function snoozeReminder(userId, dateTime) {
  deleteReminder(userId, dateTime);
  createReminder(userId, dateTime + SNOOZE_TIME);
}

function handleIntents(nlpResults, callback) {
  callback(null, nlpResults);
}

module.exports = {
  createReminder,
  deleteReminder,
  getReminders,
  confirmReminder,
  snoozeReminder,
  handleIntents,
};
