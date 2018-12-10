const remindersRepository = require('../data/remindersRepository');

const SNOOZE_TIME = 5000;

function createReminder(userId, dateTime) {
  return remindersRepository.createReminder(userId, dateTime);
}

function deleteReminder(userId, dateTime) {
  return remindersRepository.deleteReminder(userId, dateTime);
}

function getReminders(userId) {
  return remindersRepository.getReminders(userId);
}

function confirmReminder(userId, dateTime) {
  return deleteReminder(userId, dateTime);
}

function snoozeReminder(userId, dateTime) {
  deleteReminder(userId, dateTime);
  createReminder(userId, dateTime + SNOOZE_TIME);
}

module.exports = {
  createReminder,
  deleteReminder,
  getReminders,
  confirmReminder,
  snoozeReminder,
};
