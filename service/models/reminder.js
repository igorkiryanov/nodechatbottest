module.exports = class Reminder {
  constructor(id, dateTime) {
    this.idValue = id;
    this.dateTimeValue = dateTime;
  }

  get id() {
    return this.idValue;
  }

  set id(value) {
    this.idValue = value;
  }

  get dateTime() {
    return this.dateTimeValue;
  }

  set dateTime(value) {
    this.dateTimeValue = value;
  }

  toString() {
    return `Reminder for ${this.dateTimeValue.toLocaleString()}`;
  }

  static compare(reminderA, reminderB) {
    return reminderA.dateTime - reminderB.dateTime;
  }
};
