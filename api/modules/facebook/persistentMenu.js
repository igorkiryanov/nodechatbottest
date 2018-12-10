const disableInput = false;

module.exports = (bot) => {
  bot.setPersistentMenu([
    {
      title: 'My Account',
      type: 'nested',
      call_to_actions: [
        {
          title: 'Pay Bill',
          type: 'postback',
          payload: 'PAYBILL_PAYLOAD',
        },
        {
          title: 'History',
          type: 'postback',
          payload: 'HISTORY_PAYLOAD',
        },
        {
          title: 'Contact Info',
          type: 'postback',
          payload: 'CONTACT_INFO_PAYLOAD',
        },
      ],
    },
    {
      title: 'Go to Website',
      type: 'web_url',
      url: 'http://purple.com',
    },
  ], disableInput);

  bot.on('postback:PAYBILL_PAYLOAD', (payload, chat) => {
    chat.say('Pay Bill here...');
  });

  bot.on('postback:HISTORY_PAYLOAD', (payload, chat) => {
    chat.say('History here...');
  });

  bot.on('postback:CONTACT_INFO_PAYLOAD', (payload, chat) => {
    chat.say('Contact info here...');
  });
};
