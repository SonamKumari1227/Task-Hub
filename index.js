const express = require("express");
const app = express();
require('dotenv').config();

const bodyParser = require("body-parser");
const ejs = require('ejs');
const path = require("path");
require('./conn/connection');
const User = require("./models/user");
const Task = require('./models/Task');
const twilio = require('twilio');
const mongoose = require("mongoose");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up environment variables for MongoDB connection
app.set('views', path.join(__dirname, 'views'));
console.log("path= ", path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Require the router module and assign it to a variable
const routingRouter = require('./Router/routing');

// Use the router as middleware
app.use('/', routingRouter);

// Define your other routes here
app.get('/', (req, res) => {
    res.send('Hello, this is the home route!');
});

app.listen(8000, 'localhost', () => {
    console.log("server is listening.......");
});
