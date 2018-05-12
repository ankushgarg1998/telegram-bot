'use strict'

const Telegram = require('telegram-node-bot');

class OtherwiseController extends Telegram.TelegramBaseController {
    handle($) {
        console.log($.message.chat.id);
        $.sendMessage('Sorry! I don\'t identify this command. Say what ?');
    }
}

module.exports = OtherwiseController;