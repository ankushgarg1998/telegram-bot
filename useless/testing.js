$.runMenu({
    message: 'Select:',
    layout: [1, 2, 1, 1, 1, 2, 1, 1],
    '/details': ($) => {this.detailsHandler($)}, //will be on first line
    'test2': () => {}, //will be on second line
    'test3': () => {}, //will be on second line
    'test4': () => {}, //will be on third line
    'test5': () => {}, //will be on fourth line
    'test6': () => {}, //will be on first line
    'test7': () => {}, //will be on second line
    'test8': () => {}, //will be on second line
    'test9': () => {}, //will be on third line
    'test10': () => {}, //will be on fourth line
    options: {
        parse_mode: 'Markdown' // in options field you can pass some additional data, like parse_mode
    },
    'Exit': {
        message: 'Do you realy want to exit?',
        resizeKeyboard: true,
        'yes': () => {

        },
        'no': () => {

        }
    },
    'anyMatch': () => { //will be executed at any other message

    }
})


$.runInlineMenu({
    layout: 2, //some layouting here
    method: 'sendMessage', //here you must pass the method name
    params: ['text'], //here you must pass the parameters for that method
    menu: [
        {
            text: '1', //text of the button
            callback: (callbackQuery, message) => { //to your callback will be passed callbackQuery and response from method
                console.log(1)
            }
        },
        {
            text: 'Exit',
            message: 'Are you sure?',
            layout: 2,
            menu: [ //Sub menu (current message will be edited)
                {
                    text: 'Yes!',
                    callback: () => {

                    }
                },
                {
                    text: 'No!',
                    callback: () => {

                    }
                }
            ]
        }
    ]
})