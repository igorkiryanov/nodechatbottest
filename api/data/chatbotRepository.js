const mongoose = require('mongoose');
require('dotenv').config();

function connect() {
  return mongoose.connect(`mongodb://${process.env.MONGO_ATLAS_USR}:${process.env.MONGO_ATLAS_PWD}@nodechatbottest-shard-00-00-s4bul.azure.mongodb.net:27017,nodechatbottest-shard-00-01-s4bul.azure.mongodb.net:27017,nodechatbottest-shard-00-02-s4bul.azure.mongodb.net:27017/test?ssl=true&replicaSet=NodeChatbotTest-shard-0&authSource=admin&retryWrites=true`, { useNewUrlParser: true });
}

exports = {
  connect,
};
