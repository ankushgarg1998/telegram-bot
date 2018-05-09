'use strict'

const Telegram = require('telegram-node-bot');
var fs = require('fs');
var dataObj = JSON.parse(fs.readFileSync('./datastore/data.json', 'utf8'));

class ParticipantController extends Telegram.TelegramBaseController {

    detailsHandler($) {
        $.sendMessage(dataObj.details);
    }

    criteriaHandler($) {
        $.sendMessage(dataObj.criteria);
    }

    scheduleHandler($) {
        $.sendMessage(dataObj.schedule);
    }

    locationHandler($) {
        $.sendLocation(dataObj.location.latitude, dataObj.location.longitude);
    }

    applyHandler($) {
        $.sendMessage(`You are applying for ${dataObj.hackathonName}.\n\nPlease enter you name :`);
        $.waitForRequest
            .then($ => {
                let newApplicant = {
                    "name": $.message.text,
                    "chatID": $.message.chat.id
                };
                dataObj.applicants.push(newApplicant);
                $.sendMessage(`You have successfully applied!`);
                $.sendMessage(`New Application: ${newApplicant.name}.`, {
                    'chat_id': dataObj.masterChatID
                });
            });
    }

    allAnnouncementsHandler($) {
        $.sendMessage(`All announcements\n\n`);
        dataObj.announcements.forEach(announcement => {
            $.sendMessage(`ANNOUNCEMENT\n\n${announcement}`);
        })
    }

    get routes() {
        return {
            'detailsCommand': 'detailsHandler',
            'criteriaCommand': 'criteriaHandler',
            'scheduleCommand': 'scheduleHandler',
            'locationCommand': 'locationHandler',
            'applyCommand': 'applyHandler',
            'allAnnouncementsCommand': 'allAnnouncementsHandler',
        };
    }
}

module.exports = ParticipantController;