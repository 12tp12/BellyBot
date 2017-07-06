/*
 Please report any bugs to nicomwaks@gmail.com
 i have added console.log on line 48
 */
'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
var FormData = require('form-data');
var http = require('http');
var cloudinary = require('cloudinary');
var requestify = require('requestify');
var apiai = require('apiai');
var firebase = require('firebase');
var appApi = apiai("283317d092fc439c972e50e5cbe72a29");
const fs = require('fs');



firebase.initializeApp({
    // credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://bellybot-929a5.firebaseio.com"
})
var ref = firebase.app().database().ref();


const app = express()
const imageRecApi = "https://api-2445582032290.production.gw.apicast.io/v1/foodrecognition?user_key=18689360b118be4a6df89f9f340a8934";
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
        let text = ""
        let isImage = false;

        let messaging_events = req.body.entry[0].messaging;

        //Check if it's an image
        if(messaging_events && messaging_events[0] && messaging_events[0].message && messaging_events[0].message.attachments && messaging_events[0].message.attachments[0] && messaging_events[0].message.attachments[0].payload && messaging_events[0].message.attachments[0].payload.url) {
            let imageURL = messaging_events[0].message.attachments[0].payload.url;

            if (imageURL) {
                ///Upload the image
                let img = cloudinary.uploader.upload(imageURL,
                    function (result) {
                        let public_id = result.public_id;
                        //Resize the image
                        let resizedImg = cloudinary.url(public_id,
                            {width: 544, height: 544, crop: "fill"});

                        // var file = uuid.
                        // //Send the image to the food api
                        // http.get(resizedImg, function(response) {
                        //     response.pipe(file);
                        // })

                        var foodApiRequest = request.post(imageRecApi, function (err, resp, body) {
                            if (err) {
                                console.log('Error!');
                            } else {
                                let event = req.body.entry[0].messaging[0];
                                let sender = event.sender.id;
                                let foodFound = JSON.parse(body).results[0].items[0];
                                let msg = "So you ate " + foodFound.name + " Nutrition:: Calories: " + foodFound.nutrition.calories +
                                    " Protein: " + foodFound.nutrition.protein +
                                    " Total Carbs: " + foodFound.nutrition.totalCarbs +
                                    " Total Fat: " + foodFound.nutrition.totalFat;


                                sendTextMessage(sender, msg)

                            }
                        });
                        var form = foodApiRequest.form();
                        var ls = form.append('file', request(resizedImg));


                    })
            }
        }
        //continue if it's a text
        for (let i = 0; i < messaging_events.length; i++) {
            let event = req.body.entry[0].messaging[i]
            let sender = event.sender.id

            //Check if a message exists.
            if (event.message && event.message.text) {
                var fbId = event.sender.id;

                var usersRef = ref.child(fbId);
                ref.child(fbId).set({
                    profilePic: fbId

                });
                //sends text to Api.AI
                text = event.message.text
                var apiairequest = appApi.textRequest(text, {
                    sessionId: '1'
                });
                apiairequest.on('response', function (response) {

                    if(response.result.fulfillment.speech){
                        console.log(response.result.fulfillment.speech);
                        sendTextMessage(sender, response.result.fulfillment.speech)
                    }

                    if(response.result.parameters && response.result.parameters.food) {
                        //gets the foods list from api.ai
                        let foodLst = response.result.parameters.food
                        let intentName = response.result.metadata.intentName
                        console.log(foodLst);
                        console.log(intentName);
                        sendTextMessage(sender, intentName)
                    }
                });

                apiairequest.on('error', function (error) {
                    console.log(error);
                });
                apiairequest.end();
                // return "ok";
            }
        }
        //fs.readFile(config.build.temp + 'archive.tar.gz', function(err, data){
        //    if (err){ cb(err); }
        //    else {
        //        var options = {
        //            body   : data,
        //            method : 'PUT',
        //            url    : urlObj
        //        };
        //
        //        request(options, function(err, incoming, response){
        //            if (err){ cb(err); } else { cb(null, source); }
        //        });
        //    }
        //});


        //Echos back a message
        //
        // for (let i = 0; i < messaging_events.length; i++) {
        //     let event = req.body.entry[0].messaging[i]
        //     let sender = event.sender.id
        //     if (event.message && event.message.text) {
        //         let text = event.message.text
        //         if (text === 'Generic') {
        //             console.log("welcome to chatbot")
        //             //sendGenericMessage(sender)
        //             continue
        //         }
        //         sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
        //     }
        //     if (event.postback) {
        //         let text = JSON.stringify(event.postback)
        //         sendTextMessage(sender, "Postback received: " + text.substring(0, 200), token)
        //         continue
        //     }
        // }
        res.sendStatus(200)
    }
)

// recommended to inject access tokens as environmental variables, e.g.
// const token = process.env.FB_PAGE_ACCESS_TOKEN
const token = "EAALx5PSEovYBAJnnZBWyZBGUJ7Cxio2OZBd5hTZC404ys56yh94URGryZCna9qOFQUN4poSBdgHWp2d8cxuQaPzi2PU5KLeAZAFeGoFLjUV1igbZBBb3qggLLY0clVcXrKxc6a5TYSPyN5IZA4O4gQsQdbEMUqvKJOvjaQ1hgawHKQZDZD"

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