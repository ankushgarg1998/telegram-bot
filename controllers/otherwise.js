'use strict'

const Telegram = require('telegram-node-bot');

class OtherwiseController extends Telegram.TelegramBaseController {
    handle($) {
        $.sendMessage('Sorry! I don\'t identify this command.');
    }
}

module.exports = OtherwiseController;