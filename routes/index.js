
const express = require('express');
const router = express.Router();

//Login packages
const mysql = require('mysql');


//Connection to database
var connection = mysql.createPool({
    host     : 'remotemysql.com',
	user     : 'ygBNrggUP3',
	password : process.env.DB_PASSWORD,
    database : 'ygBNrggUP3'
});

//Hello world
router.get('/', (req, res, next) => {
    

    //Read in database
    connection.query('SELECT * FROM websites', function(error, results, fields) {
    console.log("Checked if exists: ")
    console.log(results.length);
        
        var data = {};

        if (results.length > 0)
        {
            data = {
                websiteData : results
                
                   
            };         
            console.log(results);
        }
        
        res.render('index', data);
    })

     


})

module.exports = router;