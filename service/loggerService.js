const logger = require('../api/loggers/consoleLoggerProvider');

function log(message) {
  logger.log(message);
}

module.exports = { log };
