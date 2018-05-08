'use strict'

const Telegram = require('telegram-node-bot');

class TodoController extends Telegram.TelegramBaseController {
    addHandler($) {
        console.log($.message.text);
        let newTodo = $.message.text.split(' ').slice(1).join(' ');

        if(!newTodo)
            return $.sendMessage('Sorry. Please add a todo item.');

        $.getUserSession('todos')
            .then(todos => {
                if(Array.isArray(todos))
                    $.setUserSession('todos', todos.concat([newTodo]));    
                else
                    $.setUserSession('todos', [newTodo]);
                // console.log(todos);
                $.sendMessage(`${newTodo} added!`);
            });
    }

    getHandler($) {
        $.getUserSession('todos')
            .then(todos => {
                if(!Array.isArray(todos))
                    $.sendMessage('Your Todo List is Empty!');
                else
                    $.sendMessage(`**TODO LIST** \n- ${todos.join('\n- ')}`);
            })
    }

    get routes() {
        return {
            'addCommand': 'addHandler',
            'getCommand': 'getHandler'
        };
    }
}

module.exports = TodoController;