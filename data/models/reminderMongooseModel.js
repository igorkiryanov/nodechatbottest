const mongoose = require('mongoose');
require('mongoose-long')(mongoose);

const reminderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userId: { type: mongoose.Schema.Types.Long, required: true },
  dateTime: { type: mongoose.Schema.Types.Date, required: true },
});

module.exports = mongoose.model('Reminder', reminderSchema);
