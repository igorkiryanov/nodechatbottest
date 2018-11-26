const request = require('request');

function sendText(sender, text) {
  const messageData = { text };
  request({
    url: process.env.FB_MESSAGE_URL,
    qs: { access_token: process.env.FB_ACCESS_TOKEN },
    method: 'POST',
    json: {
      recipient: { id: sender },
      message: messageData,
    },
  });
}

function sendMessage(event, res) {
  const sender = event.sender.id;
  if (event.message && event.message.text) {
    sendText(sender, `Echo text: ${event.message.text}`);
    res.send(event.message.text);
  }
}

exports = {
  sendMessage,
};
