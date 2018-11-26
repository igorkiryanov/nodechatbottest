const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
mongoose.connect(`mongodb://${process.env.MONGO_ATLAS_USR}:${process.env.MONGO_ATLAS_PWD}@nodechatbottest-shard-00-00-s4bul.azure.mongodb.net:27017,nodechatbottest-shard-00-01-s4bul.azure.mongodb.net:27017,nodechatbottest-shard-00-02-s4bul.azure.mongodb.net:27017/test?ssl=true&replicaSet=NodeChatbotTest-shard-0&authSource=admin&retryWrites=true`, { useNewUrlParser: true });
// mongoose.connect(`mongodb+srv://${process.env.MONGO_ATLAS_USR}:${process.env.MONGO_ATLAS_PWD}@nodechatbottest-s4bul.azure.mongodb.net/test?retryWrites=true`, { useNewUrlParser: true });

app.set('port', process.env.PORT || process.env.LOCAL_PORT);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send("Hi, I'm chatbot!");
});

app.get('/webhook/', (req, res) => {
  if (req.query['hub.verify_token'] === process.env.FB_SECRET) {
    return res.send(req.query['hub.challenge']);
  }
  return res.send('Wrong token!');
});

function sendText(sender, text) {
  const messageData = { text };
  request({
    url: 'https://graph.facebook.com/v3.2/me/messages',
    qs: { access_token: 'EAAEtYgj66KkBAMzfWMC8c1d91TUJ4QYjc9hcL0yJTh1OrgZCttHlooEAxIH5bUVRAp3pHwOuDfIW7ITygsZC2PXLJtZBasRRJXHvjFi1cimG67wxyZACtIH5API1CK91FjlYTQFF1RFyUn6WLGyzhnbEImaYQknzhIYrPhfJo7bZB8BMtqLoo' },
    method: 'POST',
    json: {
      recipient: { id: sender },
      message: messageData,
    },
  });
}

app.post('/webhook/', (req, res) => {
  const messagingEvents = req.body.entry[0].messaging;
  for (let i = 0; i < messagingEvents.length; i += 1) {
    const event = messagingEvents[i];
    const sender = event.sender.id;
    if (event.message && event.message.text) {
      sendText(sender, `Echo text: ${event.message.text}`);
      res.send(event.message.text);
    }
  }
  res.status(200);
});

app.listen(app.get('port'), () => {
});
