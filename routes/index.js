const express = require("express");
const router = express.Router();

//Login packages
const mysql = require("mysql");

//Connection to database
var connection = mysql.createPool({
  host: "remotemysql.com",
  user: "ygBNrggUP3",
  password: process.env.DB_PASSWORD,
  database: "ygBNrggUP3",
});

//Hello world
router.get("/", (req, res, next) => {
  var data = {};
  var gotFromWebsites = false;
  var gotFromParagraphs = true;

  //Read in website/game data
  connection.query("SELECT * FROM websites", function (error, results, fields) {
    console.log("Checked if exists: ");
    console.log(results.length);

    if (results.length > 0) {
      let orderedArray = [];
      for (let i = 0; i < results.length; i++) {
        //Go through all names and see if the order matches
        results.forEach((element) => {
          if (element.order_displayed == i) {
            orderedArray.push(element);
          }
        });
      }

      console.log("Ordered Data:", orderedArray);

      data.websiteData = orderedArray;

      gotFromWebsites = true;
    }

    if (gotFromParagraphs && gotFromWebsites) {
      console.log(data);
      //console.log(results);
      res.render("index", data);
    }
  });

  //Extra table
  /*
    /Read in general paragraph data
    connection.query('SELECT * FROM paragraphs', function(error, results, fields) {
    console.log("Checked if exists: ")
    console.log(results.length);
        

        if (results.length > 0)
        {
            data.paragraphData = results;

            gotFromParagraphs = true;
        }

        if(gotFromParagraphs && gotFromWebsites)
        {
        console.log(data);
        res.render('index', data);
        }
    })
    */
});

function sortWebsiteData() {}

module.exports = router;
