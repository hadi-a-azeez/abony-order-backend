//Dependencies:
//yarn add express cors twilio

const express = require("express");
const cors = require("cors");
const twilio = require("twilio");
require("dotenv").config();

//twilio requirements -- Texting API
const client = new twilio(process.env.accountSid, process.env.authToken);

const app = express(); //alias

app.use(cors()); //Blocks browser from restricting any data

//Welcome Page for the Server
app.get("/", (req, res) => {
  res.send("Welcome to the Express Server");
});

//Twilio
app.get("/send-text", (req, res) => {
  console.log("Sending Text");

  //_GET Variables
  const { recipient, textmessage } = req.query;

  //Send Text
  client.messages
    .create({
      body: textmessage,
      to: "+91" + recipient, // Text this number
      from: "+18434387145   ", // From a valid Twilio number
    })
    .then((message) => {
      res.send({
        message: message.body,
        to: message.to,
        from: message.from,
        status: message.status,
      });
      console.log(message.body);
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
});

app.listen(4000, () => console.log("Running on Port 4000"));
