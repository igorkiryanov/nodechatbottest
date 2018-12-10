const nlpProvider = require('../nlp/nlpLUISProvider');

function handleMessage(payload, chat, data, callback) {
  nlpProvider.handleMessage(payload, chat, data, (err, nlpResults) => {
    if (callback) callback(err, nlpResults);
  });
}

module.exports = { handleMessage };
