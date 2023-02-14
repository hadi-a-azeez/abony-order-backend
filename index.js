//Dependencies:
//yarn add express cors twilio

const express = require("express");
const cors = require("cors");
const twilio = require("twilio");
require("dotenv").config();
const AWS = require("aws-sdk");

const port = process.env.PORT || 4000;

//twilio requirements -- Texting API
const client = new twilio(process.env.accountSid, process.env.authToken);

const app = express(); //alias

//allow https:kardano.vercel.app and https:abonyorder.netlify.app to access the server
app.use(
  cors({
    origin: ["https://kardano.vercel.app", "https://abonyorder.netlify.app"],
  })
);

//Welcome Page for the Server
app.get("/", (req, res) => {
  res.send("Welcome to the Express Server");
});

app.get("/send-text-aws", (req, res) => {
  console.log("Message = " + req.query.message);
  console.log("Number = " + req.query.number);
  console.log("Subject = " + req.query.subject);
  var params = {
    Message: req.query.message,
    PhoneNumber: "+" + req.query.number,
    MessageAttributes: {
      "AWS.SNS.SMS.SenderID": {
        DataType: "String",
        StringValue: req.query.subject,
      },
    },
  };

  var publishTextPromise = new AWS.SNS({ apiVersion: "2010-03-31" })
    .publish(params)
    .promise();

  publishTextPromise
    .then(function (data) {
      console.log("MessageID is " + data.MessageId);
      res.end(JSON.stringify({ MessageID: data.MessageId }));
    })
    .catch(function (err) {
      console.log("Error: " + err);
      res.end(JSON.stringify({ Error: err }));
    });
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
      from: "+18434387145", // From a valid Twilio number
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

app.listen(port, () => console.log("Running on Port 4000"));
