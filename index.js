const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require('ejs');
const path = require("path");
require('./conn/connection')
const User=require("./models/user")
// Set up environment variables for MongoDB connection
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



app.set('views', path.join(__dirname, 'views'));
console.log("path= ", path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    try {
      
        res.render('index');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/store', async (req, res) => {
    try {
        const { name, favFood } = req.body;
        if (!name || !favFood) {
            return res.status(400).send("Both 'name' and 'favFood' are required fields.");
        }

        const new_user = new User({
            "name": name,
            "favFood": favFood
        });

        await new_user.save();

        console.log("User saved successfully....");
        res.status(201).send("Data saved successfully....");
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



app.listen(8000, 'localhost', () => {
    console.log("server is listening.......");
});
