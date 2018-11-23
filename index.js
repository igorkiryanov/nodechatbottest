const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');

const app = express();

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send("Hi, I'm chatbot!");
});

app.get('/webhook/', (req, res) => {
    if (req.query["hub.verify_token"] === "test"){
        return res.send(req.query["hub.challenge"]);
    }
    res.send("Wrong token!");
});

app.listen(app.get('port'), () => {
    console.log('Listening...');
});