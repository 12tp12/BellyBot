/*
 Please report any bugs to nicomwaks@gmail.com
 i have added console.log on line 48
 */
'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
var cloudinary = require('cloudinary');
var requestify = require('requestify');

const app = express()

cloudinary.config({
    cloud_name: 'itzik',
    api_key: '767683143553225',
    api_secret: 'CS0Kee6yXBWCZT25grMUntovyfw'
});


app.set('port', (process.env.PORT || 3000))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

// index
app.get('/', function (req, res) {
    res.send('hello world i am a secret bot')
})

// for facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'bellyisthebest') {
        res.send(req.query['hub.challenge'])
    } else {
        res.send('Error, wrong token')
    }
})

// to post data
app.post('/webhook/', function (req, res) {
    var apiai = require('apiai');

    var app = apiai("283317d092fc439c972e50e5cbe72a29");

    var request = app.textRequest('I just ate an apple', {
        sessionId: '1'
    });

    request.on('response', function(response) {
        console.log(response);
    });

    request.on('error', function(error) {
        console.log(error);
    });


    var entrequest = app.userEntitiesRequest('I just ate an apple', {
        sessionId: '1'
    });
    entrequest.on('response', function(response) {
        console.log(response);
    });

    entrequest.on('error', function(error) {
        console.log(error);
    });


    request.end();
        return "ok";
    fs.readFile(config.build.temp + 'archive.tar.gz', function(err, data){
        if (err){ cb(err); }
        else {
            var options = {
                body   : data,
                method : 'PUT',
                url    : urlObj
            };

            request(options, function(err, incoming, response){
                if (err){ cb(err); } else { cb(null, source); }
            });
        }
    });

    return "thnkass";

    ///change the image size to 544 544
    let img = cloudinary.uploader.upload("https://scontent.xx.fbcdn.net/v/t35.0-12/19814197_10213074842175520_1929313793_o.jpg?_nc_ad=z-m&oh=46415535aeaec95f129aa1d7f40c0e9b&oe=59616C0C",
        function (result) {
            let public_id = result.public_id;
            let resizedImg = cloudinary.url(public_id,
                {width: 544, height: 544, crop: "fill"});

            requestify.post('http://example.com', {
                hello: 'world'
            })
                .then(function (response) {
                    // Get the response body
                    response.getBody();
                });




        });


    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.entry[0].messaging[i]
        let sender = event.sender.id
        if (event.message && event.message.text) {
            let text = event.message.text
            if (text === 'Generic') {
                console.log("welcome to chatbot")
                //sendGenericMessage(sender)
                continue
            }
            sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
        }
        if (event.postback) {
            let text = JSON.stringify(event.postback)
            sendTextMessage(sender, "Postback received: " + text.substring(0, 200), token)
            continue
        }
    }
    res.sendStatus(200)
})


// recommended to inject access tokens as environmental variables, e.g.
// const token = process.env.FB_PAGE_ACCESS_TOKEN
const token = "EAAB2M6AR0pcBANMdk9i78f3xg9NvKBNycWQf8aJVsmk9bPi1VZClN1U02qZA6ZCIu3IJgLTRMqD7R58uZC4oIdk6Pn9Oe6l3ao0IPPMD9Skta3iVIsICNyCwj0Yk72j4aMA7koI9oi2KjajwbzvBG4u4gBZBAIOxTbfORSk3CSAZDZD"

function sendTextMessage(sender, text) {
    let messageData = {text: text}

    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: token},
        method: 'POST',
        json: {
            recipient: {id: sender},
            message: messageData,
        }
    }, function (error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function sendGenericMessage(sender) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "First card",
                    "subtitle": "Element #1 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.messenger.com",
                        "title": "web url"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for first element in a generic bubble",
                    }],
                }, {
                    "title": "Second card",
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for second element in a generic bubble",
                    }],
                }]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: token},
        method: 'POST',
        json: {
            recipient: {id: sender},
            message: messageData,
        }
    }, function (error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

// spin spin sugar
app.listen(app.get('port'), function () {
    console.log('running on port', app.get('port'))
})