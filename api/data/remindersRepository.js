const chatbotRepository = require('./chatbotRepository');

function createReminder(userId, dateTime) {
  chatbotRepository.connect();
  console.log(userId, dateTime);
}

function deleteReminder(userId, dateTime) {
  console.log(userId, dateTime);
}

function getReminders(userId) {
  console.log(userId);
}

module.exports = { createReminder, deleteReminder, getReminders };
