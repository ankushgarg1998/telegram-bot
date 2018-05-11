'use strict'

const Telegram = require('telegram-node-bot');
var fs = require('fs');
var dataObj = JSON.parse(fs.readFileSync('./datastore/data.json', 'utf8'));

class CommandController extends Telegram.TelegramBaseController {

    // FUNCTIONS------------------------------------------------------------
    findInSubscribers(chatID) {
        return dataObj.subscribers.find(subscriber => subscriber.chatID == chatID);
    }

    // PARTICIPANTS' FEATURES-----------------------------------------------
    detailsHandler($) {
        $.sendMessage(dataObj.details);
        $.sendPhoto(dataObj.poster);
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

    // applyHandler($) {
    //     $.sendMessage(`You are now subscribed to the updates of ${dataObj.hackathonName}. You can unsubscribe anytime you want.\n\nHappy Hacking!`);
    //     $.waitForRequest
    //         .then($ => {
    //             let newApplicant = {
    //                 "name": $.message.text,
    //                 "chatID": $.message.chat.id
    //             };
    //             dataObj.applicants.push(newApplicant);
    //             $.sendMessage(`You have successfully applied!`);
    //             $.sendMessage(`New Application: ${newApplicant.name}.`, {
    //                 'chat_id': dataObj.masterChatID
    //             });
    //         });
    // }

    subscribeHandler($) {
        if (this.findInSubscribers($.message.chat.id))
            $.sendMessage(`You are already subscribed to ${dataObj.hackathonName}`);
        else {
            let newSubscriber = {
                "firstName": $.message.from.firstName,
                "lastName": $.message.from.lastName,
                "username": $.message.from.username,
                "chatID": $.message.chat.id
            };
            dataObj.subscribers.push(newSubscriber);
            $.sendMessage(`You are now subscribed to the updates of ${dataObj.hackathonName}. You can unsubscribe anytime you want.\n\nHappy Hacking!`);
            $.sendMessage(`New Subscriber: ${newSubscriber.firstName} ${newSubscriber.lastName}.`, {
                'chat_id': dataObj.masterChatID
            });
        }
    }

    unsubscribeHandler($) {
        const unsubscriber = this.findInSubscribers($.message.chat.id);
        if (unsubscriber) {
            dataObj.subscribers.pop(unsubscriber);
            $.sendMessage(`You\'ve been unsubscribed. You\'ll no longer be receiving updates from ${dataObj.hackathonName}`);
            $.sendMessage(`${unsubscriber.firstName} ${unsubscriber.lastName} Unsubscribed!`, {
                'chat_id': dataObj.masterChatID
            });
        } else
            $.sendMessage(`You are not subscribed to ${dataObj.hackathonName}.`);

    }

    allAnnouncementsHandler($) {
        $.sendMessage(`ALL ANNOUNCEMENTS`);
        dataObj.announcements.forEach((announcement, index) => {
            $.sendMessage(`ANNOUNCEMENT #${index+1}\n\n${announcement}`);
        })
    }

    sharepicHandler($) {
        $.sendMessage('Cool. Show me what you clicked!');
        $.waitForRequest
            .then($ => {
                const fileID = $.message.photo[$.message.photo.length - 1].fileId;
                // console.log($.getFile(fileID));
                $.sendPhoto(fileID, {
                    'chat_id': dataObj.masterChatID
                });
                $.sendMessage(`${$.message.chat.firstName} shared a picture.`, {
                    'chat_id': dataObj.masterChatID
                });
                $.sendMessage(`Your photo has been shared!`);
            });
    }

    feedbackHandler($) {
        $.sendMessage(`We'd love to hear from you. Even if it is critisicm. :D\nPlease enter your feedback.`);
        // var options = {
        //     reply_markup: JSON.stringify({
        //       inline_keyboard: [
        //         [{ text: 'Some button text 1', url: '/asdf' }],
        //         [{ text: 'Some button text 2', callback_data: '2' }],
        //         [{ text: 'Some button text 3', callback_data: '3' }]
        //       ]
        //     })
        //   };
        // $.sendMessage("Lol", options);
        // $.runInlineMenu({
        //     layout: 1,
        //     method: 'sendMessage',
        //     params: [`We'd love to hear from you. Even if it is critisicm. :D\nPlease enter your feedback.`],
        //     menu: [{
        //         text: 'Cancel',
        //         callback: (callbackQuery, message) => {
        //             $.sendMessage('Cancel');
        //             console.log($);
        //             $.waitingRequests = {};
        //         }
        //     }]
        // })
        $.waitForRequest
            .then($ => {
                if (!$.message.text) {
                    $.sendMessage(`Can't seem to understand this format. Please try again with a plain text announcement!`);
                    return;
                } else if ($.message.text == 'Cancel') {
                    $.sendMessage(`Alright!`);
                    return;
                }
                const newFeedback = {
                    "firstName": $.message.from.firstName,
                    "lastName": $.message.from.lastName,
                    "username": $.message.from.username,
                    "chatID": $.message.chat.id,
                    "feedback": $.message.text
                }
                dataObj.feedbacks.push(newFeedback);
                $.sendMessage(`Your feedback has been sent to the organisers. Thanks for your time!`);
                $.sendMessage(`New Feedback from @${newFeedback.username}.\n\n${newFeedback.feedback}`, {
                    'chat_id': dataObj.masterChatID
                });
            });
    }

    // ORGANISERS' FEATURES-------------------------------------------------

    newPosterHandler($) {
        if ($.message.from.username == dataObj.masterUserName) {
            $.sendMessage('Send me the image of the Poster.')
            $.waitForRequest
                .then($ => {
                    const fileID = $.message.photo[$.message.photo.length - 1].fileId;
                    dataObj.poster = fileID;
                    $.sendMessage(`New Poster is set. This will be shared with the participants along with the details.`);
                });
        } else
            $.sendMessage('You are not authorized for this command!');
    }

    removePosterHandler($) {
        if ($.message.from.username == dataObj.masterUserName) {
            dataObj.poster = '';
            $.sendMessage('The Poster has been removed.');
        } else
            $.sendMessage('You are not authorized for this command!');
    }

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

    allSubscribersHandler($) {
        if ($.message.from.username == dataObj.masterUserName) {
            let subscribersList = 'List of Subscribers\n\n';
            dataObj.subscribers.forEach((subscriber, i) => {
                subscribersList += `${i+1}. ${subscriber.firstName} ${subscriber.lastName}\n`;
            })
            $.sendMessage(subscribersList);
        } else
            $.sendMessage('You are not authorized for this command!');
    }

    announcementHandler($) {
        if ($.message.from.username == dataObj.masterUserName) {
            $.sendMessage(`This announcement will be sent to all the subscribers.\n\nEnter the announcement :`)
            $.waitForRequest
                .then($ => {
                    if (!$.message.text) {
                        $.sendMessage(`Can't seem to understand this format. Please try again with a plain text announcement!`);
                        return;
                    }
                    dataObj.announcements.push($.message.text);
                    dataObj.subscribers.forEach(subscriber => {
                        $.sendMessage(`ANNOUNCEMENT\n\n${$.message.text}`, {
                            'chat_id': subscriber.chatID
                        });
                    });
                    $.sendMessage(`${$.message.text}\n\nThis announcement has been sent to all the subscribers.`);
                });
        } else
            $.sendMessage('You are not authorized for this command!');
    }

    broadcastPicHandler($) {
        if ($.message.from.username == dataObj.masterUserName) {
            $.sendMessage('Ok. Send me the image.');
            $.waitForRequest
                .then($ => {
                    const fileID = $.message.photo[$.message.photo.length - 1].fileId;
                    dataObj.subscribers.forEach(subscriber => {
                        $.sendMessage(`Broadcast Image :`, {
                            'chat_id': subscriber.chatID
                        });
                        $.sendPhoto(fileID, {
                            'chat_id': subscriber.chatID
                        });
                    });
                    $.sendMessage(`This image has been shared with all the subscribers.`);
                });
        } else
            $.sendMessage('You are not authorized for this command!');
    }

    allFeedbacksHandler($) {
        if ($.message.from.username == dataObj.masterUserName) {
            $.sendMessage(`ALL FEEDBACKS`);
            dataObj.feedbacks.forEach((feedback, index) => {
                $.sendMessage(`FEEDBACK #${index+1}\nfrom @${feedback.username}\n\n${feedback.feedback}`);
            })
        } else
            $.sendMessage('You are not authorized for this command!');
    }

    // TESTING FEATURES-----------------------------------------------------
    testHandler($) {}

    helpHandler($) {
        $.sendMessage(dataObj.help, {
            "parse_mode": "Markdown"
        });
    }

    // ROUTES---------------------------------------------------------------
    get routes() {
        return {
            'detailsCommand': 'detailsHandler',
            'criteriaCommand': 'criteriaHandler',
            'scheduleCommand': 'scheduleHandler',
            'locationCommand': 'locationHandler',
            'subscribeCommand': 'subscribeHandler',
            'unsubscribeCommand': 'unsubscribeHandler',
            'allAnnouncementsCommand': 'allAnnouncementsHandler',
            'sharepicCommand': 'sharepicHandler',
            'feedbackCommand': 'feedbackHandler',

            'newPosterCommand': 'newPosterHandler',
            'removePosterCommand': 'removePosterHandler',
            'editDetailsCommand': 'editDetailsHandler',
            'editCriteriaCommand': 'editCriteriaHandler',
            'editScheduleCommand': 'editScheduleHandler',
            'editLocationCommand': 'editLocationHandler',
            'allSubscribersCommand': 'allSubscribersHandler',
            'announcementCommand': 'announcementHandler',
            'broadcastPicCommand': 'broadcastPicHandler',
            'allFeedbacksCommand': 'allFeedbacksHandler',

            'testCommand': 'testHandler',
            'helpCommand': 'helpHandler'
        };
    }
}

module.exports = CommandController;