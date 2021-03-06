'use strict'

const express = require('express')
const bodyParser = require ('body-parser')
const request = require ('request')

const app = express()

app.set('port', (process.env.PORT || 5000))

// Allows us to process data
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// ROUTES
app.get('/', function(req, res){
    res.send("Hi, I am a chatbot!")
})


let token = "EAADLZBl0iNrIBAEfwVpManreyZCQhkXVS3C3OUFEDPRnCesgIWMxh5jrazEdC1atYd5KGWtpNqa4lyxjW7CYicQVbBHZBHejQZAVN5bSCQy4NUYpJmQqCEwgdgCsRrO5d9xkMUZAIR5P6hd56UOZBqfKndfqY0plfZB9GrWVbeThAZDZD"

// Facebook
app.get('/webhook', function(req, res) {
    if (req.query['hub.verify_token'] === "currentpassword") {
        res.send(req.query['hub.challenge'])
    }
    res.send("Wrong token!")
})

app.post('/webhook/', function(req, res) {
    var myarray =[];
    myarray.push(event.sender.id)
    let messaging_events = req.body.entry[0].messaging
    // souvisi s dopocitavanim doby
    //setTimeout(

    setInterval(function() {
        for (let i = 0; i < messaging_events.length; i++) {
            let event = messaging_events[i]
            let sender = event.sender.id
           // let sender = 784619495065508
            if (event.message && event.message.text) {
                let text = event.message.text
                sendText(sender, "Text echo: " + text.substring(0, 100))
            }
        }
    },2000);

    
    // dopocitat dobu kdy chci zacit posilat zpravy
    //, timestamp - 45455)

    for (let i = 0; i < messaging_events.length; i++) {
        let event = messaging_events[i]
        let sender = event.sender.id
       // let sender = 784619495065508
        if (event.message && event.message.text) {
            let text = event.message.text
            sendText(sender, "Text echo: " + text.substring(0, 100))
        }
    }
    res.sendStatus(200)
})

function sendText(sender, text) {
    let messageData = {text: text}
    request ({
        url: "https://graph.facebook.com/v2.6/me/messages",
        qs: {access_token: token},
        method: "POST",
        json: {
            recipient: {id: sender},
            message: messageData
        }
    }, function(error, response, body) {
        if(error) {
            console.log("sending error")
        } else if(response.body.error) {
            console.log("response body error")
        }
    })
}

app.listen(app.get('port'), function(){
    console.log("running: port")
})