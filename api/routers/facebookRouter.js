const express = require('express');
const facebookService = require('../service/facebookService');
const errors = require('../errors/errors');

const router = express.Router();

router
  .route('/')
  .get((req, res) => {
    if (req.query[process.env.FB_VERIFY_TOKEN_KEY] === process.env.FB_SECRET) {
      return res.send(req.query[process.env.FB_TOKEN_SUCCESS_KEY]);
    }
    return res.status(errors.wrong_token.code).send(errors.wrong_token.message);
  })
  .post((req, res) => {
    if (req.body.entry && req.body.entry.length > 1 && req.body.entry[0].messaging) {
      for (let i = 0; i < req.body.entry[0].messaging.length; i += 1) {
        facebookService.sendMessage(req.body.entry[0].messaging[i]);
      }
      return res.status(200);
    }
    return res
      .status(errors.wrong_message_body_fb.code)
      .message(errors.wrong_message_body_fb.message);
  });

module.exports = router;
