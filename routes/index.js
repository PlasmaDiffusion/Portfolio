const express = require("express");
const router = express.Router();

//Extra packages
const chai = require("chai");
const mysql = require("mysql");

//Default page here (Shows all projects)
router.get("/", (req, res, next) => {
  readFromDatabase(res);
});

//Page that only shows one kind of project, websites or games
router.get("/:projectType", (req, res, next) => {
  console.log(req.params.projectType);
  readFromDatabase(res, req.params.projectType);
});

module.exports = router;

function readFromDatabase(res, projectType = "both") {
  var data = {};

  //Set data flags for showing each project type
  if (projectType == "both" || projectType == "games")
    data.gameProjectsEnabled = true;
  if (projectType == "both" || projectType == "websites")
    data.websiteProjectsEnabled = true;
  if (projectType == "both") data.bothProjectTypesEnabled = true;

  //Connection to database
  var connection = mysql.createPool({
    host: "remotemysql.com",
    user: "ygBNrggUP3",
    password: process.env.DB_PASSWORD,
    database: "ygBNrggUP3",
  });

  //We need to read from two tables asynchronously, so use these flags to
  var gotFromWebsites = false;
  var gotFromParagraphs = false;

  //Read in website/game data
  connection.query("SELECT * FROM websites", function (error, results, fields) {
    console.log("Checked if exists: ");
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
  connection.query("SELECT * FROM paragraphs", function (
    error,
    results,
    fields
  ) {
    console.log("Checked if exists: ");
    console.log(results.length);

    if (results.length > 0) {
      data.paragraphData = results;

      modifyParagraphData(data);

      gotFromParagraphs = true;
    }

    checkIfGotAllData(
      gotFromParagraphs,
      gotFromWebsites,
      data,
      res,
      connection
    );
  });
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
    console.log(data);

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

function modifyParagraphData(data) {
  //Overwrite paragraph 1 depending on if we're showing a specific type of project
  if (data.bothProjectTypesEnabled) return;
  if (data.gameProjectsEnabled)
    data.paragraphData[0].introParagraph1 =
      data.paragraphData[0].introParagraph1_gamesOnly;
  else if (data.websiteProjectsEnabled)
    data.paragraphData[0].introParagraph1 =
      data.paragraphData[0].introParagraph1_websitesOnly;
}
