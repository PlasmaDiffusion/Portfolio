
const express = require('express');
const router = express.Router();

//Login packages
//const mysql = require('mysql');
//const bcrypt = require('bcrypt');

let user = null;

//Global data to show in a list
const profiles = [
    {name: 'Steven', city:'Sydney', profession:'Doctor'},
    {name: 'Frank', city:'Oz', profession:'Muppetier'},
    {name: 'Michelle', city:'Sydney', profession:'Programmer'}
   ];

//Bycrpt stuff
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';
//const hash = bcrypt.hashSync(myPlaintextPassword, saltRounds);

/*/Connection to database
var connection = mysql.createPool({
    host     : 'localhost',
	user     : 'root',
	password : 'vworp1997',
	database : 'nodelogin'
});
*/

//Check if logged in
router.use((req, res, next) => {
    if (req.session.username == null && req.url != "/login" && req.url != "/signup") {
        
        res.redirect('/login');
        return
      } else {
          //Give this to the template
          user =  {username: req.session.username};
        next();
      }
      
    
});

//Login
router.get('/login', (req, res, next) => {
    res.render('login', null)
});

//Signup
router.get('/signup', (req, res, next) => {
    res.render('signup', null)
});

//Login post handler
router.post('/login', (req, res, next) => {
 const username = req.body.username
 const password = req.body.password
 
    if (username && password) {

        req.session.username = username;
        res.redirect('/');
        res.end();
        /*
        //Check if the user exists in the database
        connection.query('SELECT * FROM accounts WHERE username = ?', [username], function(error, results, fields) {
        if (results.length > 0) {
            req.session.loggedin = true;
            //req.session.username = username;
            //console.log(req.session.username);
            //res.redirect('/');
            bcrypt.compare(password, results[0].password, function(err, results) { 
                console.log(password + " = " + results);
                console.log(err);
                if(results) {
                    // Passwords match
                    console.log("It's a match!")
                    req.session.username = username;
                    res.redirect('/');
                    res.end();
                    return
                } else {
                       // Passwords don't match
                       res.send("Incorrect username/password.");
                       res.end();
                        return
                } 
            });
            

        } else {
            const data = connection.query('SELECT * FROM accounts WHERE ROWNUM=1');
            res.send("Incorrect username/password.");
        }		
        	
        //res.end();
        })
        */
        

    } else {
        res.send('Please enter Username and Password!');
        res.end();
    }

    return;
})

//Sign up
router.post('/signup', (req, res, next) => {
 
    const username = req.body.username;
    var password = req.body.password;
    const email = "none";
    
    var success = false;

    if (username && password)
    {

        req.session.username = username;
        res.redirect('/');
        res.end();
        
        /*
        //Check if username doesn't already exist
        connection.query('SELECT * FROM accounts WHERE username = ?', [username], function(error, results, fields) {
            console.log("Checked if exists: ")
            console.log(results.length);

            if (results.length > 0)
            {
                console.log("Exists already");
                res.send('Username already exists.');
                res.end();
                
            }
            else
            {
            //Hash the password and store it in the database!
            bcrypt.hash(password, saltRounds, function(err, hash) {
            // Store hash in your password DB.
            

                //Add new user into the database
                connection.getConnection(function(err) {
                //console.log(err);
                    if (err) throw err;
                    console.log("Connected!");



                    var sql = "INSERT INTO accounts(username, password, email) VALUES(?,?,?)";
                    connection.query(sql, [username, hash, email], function (err, result) {
                    if (err) throw err;
                    console.log("inserted " + username + " " + hash);
                        
                    res.redirect('/');
                  
                });
                
              });
            });
            }
        });


        */
        

          
    }
    else {
        res.send('Please enter Username and Password!');
        res.end();
        
    }


})

//Hello world
router.get('/', (req, res, next) => {
    const data = {
        name: 'Bert',
        date: req.timestamp,
        firstName: 'Bert',
        profiles: profiles,      
        user:user  
           
           
    };


    res.render('index', data);
})

//Post request with forms
router.post('/join', (req, res, next) => {
    const body = req.body
    profiles.push(body);
    res.redirect('/');
   })

//Json output
router.get('/json', (req, res, next) => {

    console.log('Timestamp: ' + req.timestamp)
    const data = {name:'David', location:'Sydney', date:req.timestamp}
    res.json(data);
})

//Queries: add ?key=value&key2=value2
router.get('/query', (req, res, next) => {
    const query = req.query;
    res.json(query);
})

//Parameters
router.get('/params/:name/:location/:occupation', (req, res, next) => {
    const params = req.params;
    res.json({
        params: params
    });
})

module.exports = router;