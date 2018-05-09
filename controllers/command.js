'use strict'

const Telegram = require('telegram-node-bot');
var fs = require('fs');
var dataObj = JSON.parse(fs.readFileSync('./datastore/data.json', 'utf8'));

class CommandController extends Telegram.TelegramBaseController {

    testHandler($) {
        console.log($.message.chat.id);
    }

    get routes() {
        return {
            'testCommand': 'testHandler'
        };
    }
}

module.exports = CommandController;