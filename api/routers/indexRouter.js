const express = require('express');

const router = express.Router();

router
  .route('/')
  .get((req, res) => {
    res.send("Hi, I'm chatbot!");
  });

module.exports = router;
