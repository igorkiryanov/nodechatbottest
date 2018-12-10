// const express = require('express');
// const bodyParser = require('body-parser');
const facebookBot = require('./api/bots/facebookBot');
// const indexRouter = require('./api/routers/indexRouter');
// const facebookRouter = require('./api/routers/facebookRouter');
require('dotenv').config();

// const app = express();

// app.set('port', process.env.PORT || process.env.LOCAL_PORT);

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// app.use('/', indexRouter);
// app.use('/webhook', facebookRouter);

// app.listen(app.get('port'), () => {
// });

facebookBot.start();
