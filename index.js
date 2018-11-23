const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
mongoose.connect(`mongodb://${process.env.MONGO_ATLAS_USR}:${process.env.MONGO_ATLAS_PWD}@nodechatbottest-shard-00-00-s4bul.azure.mongodb.net:27017,nodechatbottest-shard-00-01-s4bul.azure.mongodb.net:27017,nodechatbottest-shard-00-02-s4bul.azure.mongodb.net:27017/test?ssl=true&replicaSet=NodeChatbotTest-shard-0&authSource=admin&retryWrites=true`, { useNewUrlParser: true });
// mongoose.connect('mongodb+srv://admin:admin@nodechatbottest-s4bul.azure.mongodb.net/test?retryWrites=true', { useNewUrlParser: true });

app.set('port', process.env.PORT || 5000);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send("Hi, I'm chatbot!");
});

app.get('/webhook/', (req, res) => {
  if (req.query['hub.verify_token'] === 'test') {
    return res.send(req.query['hub.challenge']);
  }
  return res.send('Wrong token!');
});

app.listen(app.get('port'), () => {
});
