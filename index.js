'use strict';

const Telegram = require('telegram-node-bot');
const tg = new Telegram.Telegram('471463004:AAHAOrlRbzezb2-ikqjqoYKj5GUEakD8Sx4', {
    workers: 1
});

const TodoController = require('./controllers/todo');
const OtherwiseController = require('./controllers/otherwise');

const todoController = new TodoController();

tg.router.when(new Telegram.TextCommand('/add', 'addCommand'), todoController)
    .when(new Telegram.TextCommand('/get', 'getCommand'), todoController)
    .otherwise(new OtherwiseController());