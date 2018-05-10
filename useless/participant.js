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

    sharepicHandler($) {
        $.sendMessage('Cool. Show me what you clicked!');
        $.waitForRequest
            .then($ => {
                const fileID = $.message.photo[$.message.photo.length-1].fileId;
                // console.log($.getFile(fileID));
                $.sendPhoto(fileID, {'chat_id': dataObj.masterChatID});
                $.sendMessage(`${$.message.chat.firstName} shared a picture with you.`, {'chat_id': dataObj.masterChatID});
                $.sendMessage(`Your photo has been shared!`);
            });
    }

    get routes() {
        return {
            'detailsCommand': 'detailsHandler',
            'criteriaCommand': 'criteriaHandler',
            'scheduleCommand': 'scheduleHandler',
            'locationCommand': 'locationHandler',
            'applyCommand': 'applyHandler',
            'allAnnouncementsCommand': 'allAnnouncementsHandler',
            'sharepicCommand': 'sharepicHandler'
        };
    }
}

module.exports = ParticipantController;