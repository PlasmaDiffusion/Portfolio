const express = require("express");
const router = express.Router();

//Extra packages
const chai = require("chai");
const mysql = require("mysql");
var nodemailer = require("nodemailer");

// Routes ---------------------------------------------------------------------------------------------------------------------

//Default page here (Shows all projects)
router.get("/", (req, res, next) => {
  readFromDatabase(res);
});

//Page that only shows one kind of project, websites or games
router.get("/:projectType", (req, res, next) => {
  //console.log(req.params.projectType);
  readFromDatabase(res, req.params.projectType);
});

//Post the email form
router.post("/", (req, res, next) => {
  sendEmail(req, res);
});
router.post("/:projectType", (req, res, next) => {
  sendEmail(req, res);
});

module.exports = router;

// Global functions ---------------------------------------------------------------------------------------------------------

function readFromDatabase(res, projectType = "websites", messageSent = 0) {
  var data = {};

  //Resonse to a message being sent. This only occurs from post methods.
  if (messageSent == 1)
    data.messageSent = "Your message was sent. I'll get back to you shortly.";
  else if (messageSent == 2)
    data.messageSent = "Error. The message wasn't sent.";

  //Set data flags for showing each project type
  if (projectType == "all" || projectType == "games")
    data.gameProjectsEnabled = true;
  if (projectType == "all" || projectType == "websites")
    data.websiteProjectsEnabled = true;
  if (projectType == "all") data.bothProjectTypesEnabled = true;

  //Connection to database
  var connection = mysql.createPool({
    host: "portfolio.c0i3n83nezil.us-east-2.rds.amazonaws.com",
    user: "admin",
    password: process.env.DB_PASS,
    database: process.env.DATABASE,
  });

  //We need to read from two tables asynchronously, so use these flags to
  var gotFromWebsites = false;
  var gotFromParagraphs = false;

  //Read in website/game data
  connection.query("SELECT * FROM projects", function (error, results, fields) {
    console.log("Project data length: ");
    console.log(results.length);

    if (results.length > 0) {
      orderProjectData(results, data);

      gotFromWebsites = true;
    }

    checkIfGotAllData(
      gotFromParagraphs,
      gotFromWebsites,
      data,
      res,
      connection
    );
  });

  //Read in general paragraph data
  connection.query(
    "SELECT * FROM paragraphs",
    function (error, results, fields) {
      if (results.length > 0) {
        data.paragraphData = results;

        modifyParagraphData(data);
        splitSkillString(data);

        gotFromParagraphs = true;
      }

      checkIfGotAllData(
        gotFromParagraphs,
        gotFromWebsites,
        data,
        res,
        connection
      );
    }
  );
}

//Render index if both table connections were successful
function checkIfGotAllData(
  gotFromParagraphs,
  gotFromWebsites,
  data,
  res,
  connection
) {
  if (gotFromParagraphs && gotFromWebsites) {
    //console.log(data);

    connection.end(function (err) {
      if (err) {
        return console.log(err.message);
      }
      console.log("Connection pool closed");
    });

    res.render("index", data);
  }
}

//Projects have an order displayed property. Sort data based on this property.
function orderProjectData(results, data) {
  let orderedArray = [];
  for (let i = 0; i < results.length; i++) {
    //Go through all names and see if the order matches
    results.forEach((element) => {
      if (element.order_displayed == i) {
        orderedArray.push(element);
      }
    });
  }

  //Confirm it sorted properly if the first order_displayed is 0
  var assert = chai.assert;
  assert.equal(orderedArray[0].order_displayed, 0);

  //Now set the finalised website data here
  data.websiteData = orderedArray;
}

//Make two arrays of skills to display from a split string
function splitSkillString(data) {
  //Make a WebDev skill string
  var splitArray = data.paragraphData[0].webDevSkills.split("|");
  var skillArray = [];
  splitArray.forEach((element) => {
    //This is needed so it can be used like a map with hogan
    skillArray.push({ name: element });
  });
  data.paragraphData[0].webDevSkills = skillArray;

  //Make a GameDev skill string
  splitArray = data.paragraphData[0].gameDevSkills.split("|");
  skillArray = [];
  splitArray.forEach((element) => {
    skillArray.push({ name: element });
  });
  data.paragraphData[0].gameDevSkills = skillArray;

  //Confirm there's now an array of strings instead of one giant string
  var assert = chai.assert;
  assert.isAbove(
    data.paragraphData[0].webDevSkills.length,
    0,
    "skill array length is greater than 1"
  );
}

//Overwrite paragraph 1 depending on if we're showing a specific type of project
function modifyParagraphData(data) {
  if (data.bothProjectTypesEnabled) return;
  if (data.gameProjectsEnabled)
    data.paragraphData[0].introParagraph1 =
      data.paragraphData[0].introParagraph1_gamesOnly;
  else if (data.websiteProjectsEnabled)
    data.paragraphData[0].introParagraph1 =
      data.paragraphData[0].introParagraph1_websitesOnly;
}

//Post routes call this after you've sent the form
function sendEmail(req, res) {
  //Format the message so line breaks exist.
  var msg = req.body.body.split("\n");
  var formattedMessage = msg.join("<br>");

  //Login to gmail
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  //Prepare the name, email and message
  var mailOptions = {
    from: "youremail@gmail.com",
    to: process.env.GMAIL_USER,
    subject: "Message From Portfolio",
    html: `<h1> ${req.body.name} (${req.body.email}) </h1> <br><br> <p> ${formattedMessage} </p>`,
  };

  //Send it to my email
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      //Render site normally
      readFromDatabase(res, req.params.projectType, true);
    } else {
      console.log("Email sent: " + info.response);
      //Render site normally
      readFromDatabase(res, req.params.projectType, true);
    }
  });
}
