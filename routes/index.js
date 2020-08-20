const express = require("express");
const router = express.Router();
const chai = require("chai");

//Login packages
const mysql = require("mysql");

//Connection to database
var connection = mysql.createPool({
  host: "remotemysql.com",
  user: "ygBNrggUP3",
  password: process.env.DB_PASSWORD,
  database: "ygBNrggUP3",
});

router.get("/", (req, res, next) => {
  var data = {};

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

    checkIfGotAllData(gotFromParagraphs, gotFromWebsites, data, res);
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

      gotFromParagraphs = true;
    }

    checkIfGotAllData(gotFromParagraphs, gotFromWebsites, data, res);
  });
});

module.exports = router;

//Render index if both table connections were successful
function checkIfGotAllData(gotFromParagraphs, gotFromWebsites, data, res) {
  if (gotFromParagraphs && gotFromWebsites) {
    console.log(data);
    connection.end();
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
