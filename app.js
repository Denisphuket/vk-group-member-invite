const easyvk = require('easyvk');
const fs = require('fs');
const conf = require('./config.json')

// Настройки
let accesstoken = conf.accesstoken; //Токен группы
let groupid = conf.groupid; //ID Группы положительное число
let postid = conf.postid; // Номер поста к которому крепить отметки



easyvk({
    access_token: accesstoken,
    session_file: __dirname + '/.my-session',
    utils: {
        bots: true
    }
}).then(vk => {


    const LPB = vk.bots.longpoll
    let user;
    let firsname;
    let lastname;
    let countmember;

    LPB.connect({
        forGetLongPollServer: {},
        forLongPollServer: {}
    }).then(({ connection }) => {

        connection.on('group_join', (users) => {
            console.log(users)
            return user = users.user_id;
        })
    })

    setInterval(() => {
        if (user) {
            console.log(user)
            vk.call('users.get', {
                user_ids: user
            }).then(vkr => {
                console.log(vkr.vkr[0])
                firsname = vkr.vkr[0].first_name;
                // lastname = vkr.vkr[0].last_name;

                vk.call('groups.getMembers', {
                    group_id: groupid,
                    count: 1,
                }).then(vkr => {
                    // console.log(vkr.vkr.count)
                    countmember = vkr.vkr.count;
                    let attachments;
                    let message;
                    let marker = `@id${user} (${firsname})`

                    // рандомные сообщения
                    fs.readFile('message.txt', function (err, data) {
                        if (err) throw err;
                        var lines = data.toString('utf-8').split("\n");
                        message = `${lines[Math.floor(Math.random() * lines.length)]}`.replace('{marker}', marker).replace('{countmember}', countmember);
                        // рандомные картинки
                        fs.readFile('attachments.txt', function (err, data) {
                            if (err) throw err;
                            var line = data.toString('utf-8').split("\n");
                        /*do something with */ line[Math.floor(Math.random() * line.length)];
                            console.log(line[Math.floor(Math.random() * line.length)])
                            attachments = line[Math.floor(Math.random() * line.length)];



                            vk.call('wall.createComment', {
                                owner_id: '-' + groupid,
                                post_id: postid,
                                message: `${message}`,
                                attachments: attachments
                            }).then(vkr => {
                                console.log(vkr.vkr)
                                return user = false;
                            });
                        })
                    })
                })
            });
        }
    }, 3000);
})
