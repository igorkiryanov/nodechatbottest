const errorHandler = require('../api/errorHandlers/consoleErrorHandlerProvider');

function handle(e) {
  errorHandler.handle(e);
}

module.exports = { handle };
