const request = require('request');

const region = 'westus';
const appId = '74059729-3abb-4b71-82d6-06d36b6214d8';
const subscriptionKey = '270feb6948954ab4a974983106ab2041';
const url = `https://${region}.api.cognitive.microsoft.com/luis/`;

function makeRequest(text, cb) {
  request(`${url}v2.0/apps/${appId}?subscription-key=${subscriptionKey}&timezoneOffset=${new Date().getTimezoneOffset()}&q=${text}`, (err, response, body) => {
    cb(err, body);
  });
}

function handleMessage(payload, chat, data, callback) {
  const messageText = payload.message.text;
  makeRequest(messageText, (err, body) => {
    const nlpResult = JSON.parse(body);
    const result = { intent: nlpResult.topScoringIntent.intent, entities: [] };
    nlpResult.entities.forEach((entity) => {
      result.entities = result.entities.concat(entity.resolution.values);
    });
    callback(err, result);
  });
}

module.exports = { handleMessage };
