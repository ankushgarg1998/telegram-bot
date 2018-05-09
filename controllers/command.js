'use strict'

const Telegram = require('telegram-node-bot');
var fs = require('fs');
var dataObj = JSON.parse(fs.readFileSync('./datastore/data.json', 'utf8'));

class CommandController extends Telegram.TelegramBaseController {
    detailsHandler($) {
        $.sendMessage(dataObj.details);
    }

    criteriaHandler($) {
        $.sendMessage(dataObj.criteria);
    }

    editDetailsHandler($) {
        if($.message.from.username == dataObj.masterUserName) {
            $.sendMessage('Old Details : \n\n' + dataObj.details + '\n\nEnter the New Details :');
            $.waitForRequest
            .then($ => {
                dataObj.details = $.message.text;
                $.sendMessage(`Details Updated! New Details are : \n\n ${dataObj.details}`);
            })
        }
        else
            $.sendMessage('You are not authorized for this command!');
    }

    editCriteriaHandler($) {
        if($.message.from.username == dataObj.masterUserName) {
            $.sendMessage('Old Judging Criteria : \n\n' + dataObj.criteria + '\n\nEnter the New Judging Criteria :');
            $.waitForRequest
                .then($ => {
                    dataObj.criteria = $.message.text;
                    $.sendMessage(`Judging Criteria Updated! New Judging Criteria is : \n\n ${dataObj.criteria}`);
                })
        }
        else
            $.sendMessage('You are not authorized for this command!');
    }

    get routes() {
        return {
            'detailsCommand': 'detailsHandler',
            'criteriaCommand': 'criteriaHandler',
            'editDetailsCommand': 'editDetailsHandler',
            'editCriteriaCommand': 'editCriteriaHandler'            
        };
    }
}

module.exports = CommandController;