'use strict';

const Telegram = require('telegram-node-bot');
const tg = new Telegram.Telegram('471463004:AAHAOrlRbzezb2-ikqjqoYKj5GUEakD8Sx4', {
    workers: 1
});

const CommandController = require('./controllers/command');
const ParticipantController = require('./controllers/participant');
const OrganiserController = require('./controllers/organiser');
const OtherwiseController = require('./controllers/otherwise');

const commandController = new CommandController();
const participantController = new ParticipantController();
const organiserController = new OrganiserController();

tg.router
    .when(new Telegram.TextCommand('/details', 'detailsCommand'), participantController)
    .when(new Telegram.TextCommand('/judgingcriteria', 'criteriaCommand'), participantController)
    .when(new Telegram.TextCommand('/schedule', 'scheduleCommand'), participantController)
    .when(new Telegram.TextCommand('/location', 'locationCommand'), participantController)
    .when(new Telegram.TextCommand('/apply', 'applyCommand'), participantController)
    .when(new Telegram.TextCommand('/allAnnouncements', 'allAnnouncementsCommand'), participantController)

    .when(new Telegram.TextCommand('/editDetails', 'editDetailsCommand'), organiserController)
    .when(new Telegram.TextCommand('/editCriteria', 'editCriteriaCommand'), organiserController)
    .when(new Telegram.TextCommand('/editSchedule', 'editScheduleCommand'), organiserController)
    .when(new Telegram.TextCommand('/editLocation', 'editLocationCommand'), organiserController)
    .when(new Telegram.TextCommand('/allApplicants', 'allApplicantsCommand'), organiserController)
    .when(new Telegram.TextCommand('/announcement', 'announcementCommand'), organiserController)
    
    .when(new Telegram.TextCommand('/test', 'testCommand'), commandController)
    .otherwise(new OtherwiseController());