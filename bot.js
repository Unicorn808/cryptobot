const Discord = require("discord.js"),
    https = require('https'),
    fs = require('fs'),
    jsDoctr = require('jsdoctr');
if (err) return console.log(err);
console.log(data);
const tokens = JSON.parse(data).tokens.coin;
const bot = new Discord.Client();
const apikey = 'nope';
jsDoctr.connect();
let cache_data = {};
let cache_timestamps = {};
let dollarGif;
bot.on("message", msg => {
    msg.content = msg.content.toLowerCase();

    if (msg.content.startsWith("!value")) {
        let messageAuthor = {
            username: msg.author.username + '#' + msg.author.discriminator,
            id: msg.author.id
        };
        jsDoctr.newMessage(jsDoctr.Message, msg.content, msg.createdTimestamp, messageAuthor, apikey);
        /*if (msg.author.id === '313285615871459341') {
        	return;

        	msg.channel.send('Sorry, but you spam to much, so you can\'t use the bot\nWould you like a taste of your own medicine?');
        	setInterval(function () {
        		msg.author.sendMessage('how do you like this spam?');
        	}, 500);
        	setTimeout(clearInterval, 30000);

        }*/
        let coins = msg.content.split(' ');
        if (coins[1] === null || coins[1] === undefined) {
            return;
        }
        coins.shift();

        if (coins.length > 5 || coins[0].includes('`')) {
            msg.channel.send('sorry mister. u can\'t spam me ;)');
            for (let i = 0; i < coins.length; i++) {
                msg.author.sendMessage(coins[i])
            }
            return;
        }
        for (let i = 0; i < coins.length; i++) {
            if (cache_data[coins[i].name] != null) {
                const date = new Date().getTime();
                if (date - cache_timestamps[coins[i]] < 1000 * 60 * 10) {
                    msg.channel.send('💸 Value of ' + responseJson[0].name + ' is `' + responseJson[0].price_usd + '` USD');
                    return cache_data[coins[i].price_usd];
                }
            }
            https.get('https://api.coinmarketcap.com/v1/ticker/' + coins[i] + '/', (res) => {
                let responseText = '';
                res.on('data', (d) => {
                    responseText += d;
                });
                res.on('end', function() {
                    if (responseText.startsWith("<")) {
                        console.log("invalid json: " + responseText);
                        msg.channel.send('invalid json: ```' + responseText + '``` This happens because <@313285615871459341> is stupid');
                        return;
                    }
                    let responseJson = JSON.parse(responseText);
                    if (responseJson.error) {
                        msg.channel.send('☠ Error: ```' + responseJson.error + ': ' + coins[i] + '```');
                    } else {
                        msg.channel.send('💸 Value of ' + responseJson[0].name + ' is `' + responseJson[0].price_usd + '` USD');
                    }
                    cache_data[coins[i]] = responseJson[0];
                    cache_timestamps[coins[i]] = new Date().getTime();

                });

            }).on('error', (e) => {
                console.error(e);
            });
        }
    }
    if (msg.content.startsWith('!ticker')) {
        let messageAuthor = {
            username: msg.author.username + '#' + msg.author.discriminator,
            id: msg.author.id
        };
        jsDoctr.newMessage(jsDoctr.Message, msg.content, msg.createdTimestamp, messageAuthor, apikey);
        https.get('https://api.coinmarketcap.com/v1/ticker/?limit=5', (res) => {
            let responseText = '';
            res.on('data', (d) => {
                responseText += d;
            });
            res.on('end', function() {
                if (responseText.startsWith("<")) {
                    console.log("invalid json: " + responseText);
                    msg.channel.send('invalid json: ```' + responseText + '``` This happens because <@313285615871459341> is stupid');
                    return;
                }
                let responseJson = JSON.parse(responseText);
                if (responseJson.error) {
                    msg.channel.send('Error: ```' + responseJson.error + '```');
                } else {
                    for (let i = 0; i < responseJson.length; i++) {
                        msg.channel.send('💸 Value of ' + responseJson[i].name + ' is `' + responseJson[i].price_usd + '` USD');
                    }

                }
            });

        }).on('error', (e) => {
            console.error(e);
        });
    }
    if (msg.content.startsWith("!customticker")) {
        let messageAuthor = {
            username: msg.author.username + '#' + msg.author.discriminator,
            id: msg.author.id
        };
        jsDoctr.newMessage(jsDoctr.Message, msg.content, msg.createdTimestamp, messageAuthor, apikey);
        let coins = msg.content.split(' ');
        if (coins[1] === null || coins[1] === undefined) {
            return msg.channel.send('Please specify a crypto');
        }
        coins.shift();

        if (coins.length > 15 || coins[0].includes('`')) {
            msg.channel.send('sorry mister. u can\'t spam me ;)');
            for (let i = 0; i < coins.length; i++) {
                msg.author.sendMessage(coins[i])
            }
            return;
        }
        let tickerList = [];
        for (let i = 0; i < coins.length; i++) {
            https.get('https://api.coinmarketcap.com/v1/ticker/' + coins[i] + '/', (res) => {
                let responseText = '';
                res.on('data', (d) => {
                    responseText += d;
                });
                res.on('end', function() {
                    if (responseText.startsWith("<")) {
                        console.log("invalid json: " + responseText);
                        msg.channel.send('invalid json: ```' + responseText + '``` This happens because <@313285615871459341> is stupid');
                        return;
                    }
                    let responseJson = JSON.parse(responseText);
                    if (responseJson.error) {
                        msg.channel.send('☠ Error: ```' + responseJson.error + ': ' + coins[i] + '```');
                    } else {
                        tickerList = tickerList.concat(responseJson);

                    }
                })
            })
        }

        setTimeout(function() {
            let tickerMessage = '';
            const embed = new Discord.RichEmbed()
                .setColor('#09c864')
                .setTimestamp()
                .setTitle('Ticker')
                .setThumbnail('https://cdn.discordapp.com/avatars/400826748389949441/366e0998d02fc7cd3ce03a6e291a7577.png')
                .addField('--------------------', '￼￼￼');
            for (let k = 0; k < tickerList.length; k++) {
                embed.addField(tickerList[k].name, '' + dollarGif + ' ' + tickerList[k].price_usd);
            }
            msg.channel.send({ embed })
                .then((m) => {
                    tickerMessage = m
                });
            setInterval(function() {
                for (let i = 0; i < coins.length; i++) {
                    https.get('https://api.coinmarketcap.com/v1/ticker/' + coins[i] + '/', (res) => {
                        let responseText = '';
                        res.on('data', (d) => {
                            responseText += d;
                        });
                        res.on('end', function() {
                            if (responseText.startsWith("<")) {
                                console.log("invalid json: " + responseText);
                                msg.channel.send('invalid json: ```' + responseText + '``` This happens because <@313285615871459341> is stupid');
                                return;
                            }
                            let responseJson = JSON.parse(responseText);
                            if (responseJson.error) {
                                console.log('Error - Can\'t update ticker:', responseJson.error);
                            } else {
                                let tickerList = [];
                                for (let i = 0; i < coins.length; i++) {
                      
                                    https.get('https://api.coinmarketcap.com/v1/ticker/' + coins[i] + '/', (res) => {
                                        let responseText = '';
                                        res.on('data', (d) => {
                                            responseText += d;
                                        });
                                        res.on('end', function() {
                                            if (responseText.startsWith("<")) {
                                                console.log("invalid json: " + responseText);
                                                msg.channel.send('invalid json: ```' + responseText + '``` This happens because <@313285615871459341> is stupid');
                                                return;
                                            }
                                            let responseJson = JSON.parse(responseText);
                                            if (responseJson.error) {
                                                msg.channel.send('☠ Error: ```' + responseJson.error + ': ' + coins[i] + '```');
                                            } else {
                                                tickerList = tickerList.concat(responseJson);

                                            }
                                        })
                                    })
                                }
                                setTimeout(function() {
                                    const embed = new Discord.RichEmbed()
                                        .setColor('#09c864')
                                        .setTimestamp()
                                        .setTitle('Ticker')
                                        .setThumbnail('https://cdn.discordapp.com/avatars/400826748389949441/366e0998d02fc7cd3ce03a6e291a7577.png')
                                        .addField('--------------------', '￼￼￼');
                                    for (let k = 0; k < tickerList.length; k++) {
                                        embed.addField(tickerList[k].name, '' + dollarGif + ' ' + tickerList[k].price_usd);
                                    }
                                    tickerMessage.edit({ embed });
                                }, 1500);
                            }
                        })
                    })
                }
            }, 5 * 60 * 1000);
        }, 1500);
    }
});
bot.on('ready', () => {
    console.log('Gettin sum crypto');
    dollarGif = bot.emojis.find("name", "dollarbot");
});

bot.login('nope');

bot.on('error', function(err) {
    console.log('some weird error, probably network related: ' + err)
});