/******************************************************************************
***
* ITE5315 – Assignment 4
* I declare that this assignment is my own work in accordance with Humber Academic Policy. 
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
* 
* Name: NEHA SHARMA Student ID: N01470004 Date: 23 November 2022
**
******************************************************************************
**/

var bcrypt = require('bcryptjs');
require('dotenv').config()
const https = require("https")
var readline = require('readline');
var rl = readline.createInterface(
  process.stdin, process.stdout);
require('dotenv').config()
var express = require('express');
var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
var express = require('express');
var path = require('path');
var app = express();

//import express-handlebars module and add express-handlebars ( template engine) to the project


app.use(express.static(path.join(__dirname, 'public')));


/** Require multer */
const multer = require('multer');
const http = require("http");
var _ = require("underscore");
const fs = require("fs");
const { Console } = require('console');
const exphbs = require('express-handlebars');
var database = require('./config/database');
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
const options ={
  key:fs.readFileSync(path.join(__dirname,'./certs/key.pem')),
  cert:fs.readFileSync(path.join(__dirname,'./certs/cert.pem')) 
}
//var port = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({ 'extended': 'true' }));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json



mongoose.Promise = global.Promise;
const db = {};
db.initialize = mongoose;
db.url = database.url;
db.Movie = require("./models/movie.js")(mongoose, mongoosePaginate);
//Display image
app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: true }));

//initialize engine with below properties

app.engine('hbs', exphbs.engine({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),

  partialsDir: [
    //  path to your partials
    path.join(__dirname, 'views/partials'),
  ]
}));

//set the engine to hbs file
app.set('view engine', 'hbs');



  db.initialize.connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => {
      console.log("Connected to the database!");

      require("./routes")(app);
      const sslserver =https.createServer(options,app)
      sslserver.listen(process.env.PORT,()=>{console.log(`Secure Server is listening on port ${process.env.PORT}`)});
      //app.listen(process.env.PORT);
      //console.log('Listening on port 8080');
    })
    .catch(err => {
      console.log("Cannot connect to the database!", err);
      process.exit();
    });



module.exports = db;



//get all movies data from db
// app.get('/api/movies', function (req, res) {
// 	// use mongoose to get all todos in the database
// 	db.Movie.find({})
// 	  .then(data => {
// 		res.send(data);
// 	  })
// 	  .catch(err => {
// 		res.status(500).send({
// 		  message:
// 			err.message || "Some error occurred while retrieving tutorials."
// 		});
// 	  });
// });




