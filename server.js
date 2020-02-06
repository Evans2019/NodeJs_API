
'use static'
require('dotenv').config();
const http = require('http');
const mysql = require('mysql');
const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs');
var util = require('util');
const mime = require('mime');
var cors = require('cors')
const app = express();
var nodemailer = require('nodemailer');
var base64Img = require('base64-img');
const port = 8080;
const path = require('path');
var uniqid = require('uniqid');
//require multer for the file uploads
var multer = require('multer');
app.use(bodyParser.urlencoded({extended: false}));
//Configuring express server
app.use(cors({ origin: "*" }));
app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))
// default options



const multipart = require('connect-multiparty');
const multipartMiddleware = multipart({
    uploadDir: 'uploads'
});

/* app.post('/api/upload', multipartMiddleware, (req, res) => {
  res.json({
      'message': 'File uploaded succesfully.'
  });
});
 */


  // transporter for emails
let transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: false,
  port: 25,
  auth: {
    user: 'etlhako12@gmail.com',
    pass: 'Evans@codecronie'
  },tls: {
    rejectUnauthorized: false
  }
})

//connection setting to mysql
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'vambo',
    multipleStatements: true
})

//Connecting to database
connection.connect((err)=> {
  if(!err)
    console.log('Connection Established Successfully');
  else
    console.log('Connection Failed!'+ JSON.stringify(err,undefined,2));
  });

const hostname = 'localhost';
  //Using Post to post data to end point/ Server
  require('./post')(app, bcrypt, connection, transporter, jwt,uniqid,mime,fs);
  require('./get')(app, connection, jwt);
  require('./delete')(app, connection);
  require('./auth')(app, bcrypt,jwt, connection);
  require('./auth.guard')(app,jwt, connection);
  require('./delete')(app, connection);

  /* app.get('/upload', (req, res) => {
    res.sendFile('./uploads/ImageWAqaxsj3k8k5xv7ttq.jpeg', { root: __dirname });
  });
 */

 // Serve Static Assets
app.use(express.static('public'));

//Establish the server connect
//Port Environment variable
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});


/* const connectDB = require("./DB/connection");
const express = require('express')
const app = express();

//calling connection for Mongoose DB
connectDB();

//Port Number 
const Port = process.env.Port || 3000;
//Checking if server started
app.listen(Port, ()=> console.log("Server started")); */



