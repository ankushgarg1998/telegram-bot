'use strict';

const Telegram = require('telegram-node-bot');
const tg = new Telegram.Telegram('471463004:AAHAOrlRbzezb2-ikqjqoYKj5GUEakD8Sx4', {
    workers: 1
});

const CommandController = require('./controllers/command');
const OtherwiseController = require('./controllers/otherwise');

const commandController = new CommandController();

tg.router.when(new Telegram.TextCommand('/details', 'detailsCommand'), commandController)
    .when(new Telegram.TextCommand('/judgingcriteria', 'criteriaCommand'), commandController)
    .when(new Telegram.TextCommand('/schedule', 'scheduleCommand'), commandController)
    .when(new Telegram.TextCommand('/location', 'locationCommand'), commandController)
    .when(new Telegram.TextCommand('/editDetails', 'editDetailsCommand'), commandController)
    .when(new Telegram.TextCommand('/editCriteria', 'editCriteriaCommand'), commandController)
    .when(new Telegram.TextCommand('/editSchedule', 'editScheduleCommand'), commandController)
    .when(new Telegram.TextCommand('/editLocation', 'editLocationCommand'), commandController)
    .when(new Telegram.TextCommand('/apply', 'applyCommand'), commandController)
    .when(new Telegram.TextCommand('/allApplicants', 'allApplicantsCommand'), commandController)
    .when(new Telegram.TextCommand('/announcement', 'announcementCommand'), commandController)
    .when(new Telegram.TextCommand('/allAnnouncements', 'allAnnouncementsCommand'), commandController)
    .when(new Telegram.TextCommand('/test', 'testCommand'), commandController)
    .otherwise(new OtherwiseController());