const nlpServiceErrorText = err => `Sorry, error with NLP service:\n${err}`;
const greetingsText = "Hello, I'm here to help you manage your reminders.";
const reminderServiceErrorText = err => `Sorry, error with reminder service:\n${err}`;
const startButtonText = 'Hello my name is Node Chatbot Test and I can create a reminders for you!';
const reminderNotFoundErrorText = 'Reminder not found';
const reminderSuccessfullySetText = date => `Reminder for ${date} successfully set!`;
const reminderSuccessfullyDeletedText = date => `Reminder for ${date} successfully deleted!`;
const datePastErrorText = date => `I'm sorry, '${date}' is already past! Please, try again or cancel`;
const reminderAlreadyExistsErrorText = date => `Reminder for ${date} already exists! Please, try again or cancel`;
const cantUnderstandMessageErrorText = message => `I'm sorry, I can't understand '${message}'! Please, try again or cancel`;
const provideReminderDateTimeText = 'Please provide date and time for reminder';
const remindersListText = list => `Reminders list:\n${list}`;
const remindersListEmptyText = 'You have no reminders';
const getRemindersErrorText = err => `Sorry, error with getting all reminders:\n${err}`;
const saveReminderErrorText = err => `Sorry, error with saving reminder\n${err}`;
const deleteReminderErrorText = err => `Sorry, error with deleting reminder\n${err}`;

module.exports = {
  nlpServiceErrorText,
  greetingsText,
  reminderServiceErrorText,
  startButtonText,
  reminderNotFoundErrorText,
  reminderSuccessfullySetText,
  reminderSuccessfullyDeletedText,
  datePastErrorText,
  reminderAlreadyExistsErrorText,
  cantUnderstandMessageErrorText,
  provideReminderDateTimeText,
  remindersListText,
  remindersListEmptyText,
  getRemindersErrorText,
  saveReminderErrorText,
  deleteReminderErrorText,
};
