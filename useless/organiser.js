'use strict'

const Telegram = require('telegram-node-bot');
var fs = require('fs');
var dataObj = JSON.parse(fs.readFileSync('./datastore/data.json', 'utf8'));

class OrganiserController extends Telegram.TelegramBaseController {

    editDetailsHandler($) {
        if ($.message.from.username == dataObj.masterUserName) {
            $.sendMessage('Old Details : \n\n' + dataObj.details + '\n\nEnter the New Details :');
            $.waitForRequest
                .then($ => {
                    dataObj.details = $.message.text;
                    $.sendMessage(`Details Updated! New Details are : \n\n${dataObj.details}`);
                });
        } else
            $.sendMessage('You are not authorized for this command!');
    }

    editCriteriaHandler($) {
        if ($.message.from.username == dataObj.masterUserName) {
            $.sendMessage('Old Judging Criteria : \n\n' + dataObj.criteria + '\n\nEnter the New Judging Criteria :');
            $.waitForRequest
                .then($ => {
                    dataObj.criteria = $.message.text;
                    $.sendMessage(`Judging Criteria Updated! New Judging Criteria is : \n\n${dataObj.criteria}`);
                });
        } else
            $.sendMessage('You are not authorized for this command!');
    }

    editScheduleHandler($) {
        if ($.message.from.username == dataObj.masterUserName) {
            $.sendMessage('Old Schedule : \n\n' + dataObj.schedule + '\n\nEnter the New Schedule :');
            $.waitForRequest
                .then($ => {
                    dataObj.schedule = $.message.text;
                    $.sendMessage(`Schedule Updated! New Schedule is : \n\n${dataObj.schedule}`);
                });
        } else
            $.sendMessage('You are not authorized for this command!');
    }

    editLocationHandler($) {
        if ($.message.from.username == dataObj.masterUserName) {
            $.sendMessage('Enter the New Location\'s Latitude :');
            $.waitForRequest
                .then($ => {
                    dataObj.location.latitude = $.message.text;
                    $.sendMessage('Enter the New Location\'s Longitude :');
                    $.waitForRequest
                        .then($ => {
                            dataObj.location.longitude = $.message.text;
                            $.sendMessage(`Location Updated! New Location is : `);
                            $.sendLocation(dataObj.location.latitude, dataObj.location.longitude);
                        })
                });
        } else
            $.sendMessage('You are not authorized for this command!');
    }

    allApplicantsHandler($) {
        if ($.message.from.username == dataObj.masterUserName) {
            let applicantsList = 'List of Applicants\n\n';
            dataObj.applicants.forEach((applicant, i) => {
                applicantsList += `${i+1}. ${applicant.name}\n`;
            })
            $.sendMessage(applicantsList);
        }
        else
            $.sendMessage('You are not authorized for this command!');
    }

    announcementHandler($) {
        if ($.message.from.username == dataObj.masterUserName) {
            $.sendMessage("This announcement will be sent to all the applicants :\n\nEnter the announcement :")
            $.waitForRequest
                .then($ => {
                    dataObj.announcements.push($.message.text);
                    dataObj.applicants.forEach(applicant => {
                        $.sendMessage(`ANNOUNCEMENT\n\n${$.message.text}`, {'chat_id': applicant.chatID});
                    });
                    $.sendMessage(`${$.message.text}\n\nThis announcement has been sent to all the applicants.`);
                });
        }
        else
            $.sendMessage('You are not authorized for this command!');
    }

    get routes() {
        return {
            'editDetailsCommand': 'editDetailsHandler',
            'editCriteriaCommand': 'editCriteriaHandler',
            'editScheduleCommand': 'editScheduleHandler',
            'editLocationCommand': 'editLocationHandler',
            'allApplicantsCommand': 'allApplicantsHandler',
            'announcementCommand': 'announcementHandler',
        };
    }
}

module.exports = OrganiserController;