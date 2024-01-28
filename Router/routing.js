const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
require('../conn/connection.js');
const User = require("../models/user");
const Task = require('../models/Task');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Define your routes here


router.get('/api', async (req, res) => {
    try {
      
        res.render('index');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
router.get('/api/register', async (req, res) => {
    try {
      
        res.render('register');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
router.get('/api/login', async (req, res) => {
    try {
      
        res.render('login');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/api/register', async (req, res) => {
    try {
        const { name, email, password, cpassword } = req.body;

        const new_user = new User({
            name: name,
            email: email,
            password: password,
            cpassword: cpassword,
        });

        await new_user.save();

        console.log('User saved successfully....');
        res.render('login');
    } catch (error) {
        console.error(error);

        // Check if the error is a Mongoose validation error
        if (error.name === 'ValidationError') {
            const validationErrors = {};

            // Extract and format validation errors
            Object.keys(error.errors).forEach((key) => {
                validationErrors[key] = error.errors[key].message;
            });

            // Send validation errors as the response
            res.status(400).json({ errors: validationErrors });
        } else {
            res.status(500).send('Internal Server Error');
        }
    }
});



router.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email, password });

        if (user) {
            // Check if the Task model for the user exists, if not, create it
            const TaskModel = mongoose.model(`Task_${user._id}`, {
                user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
                description: { type: String, required: true },
                // Add other task-related fields if needed
            });

            // Render TaskManager page with user's information
            res.render('TaskManager', { username: user.name ,id:user.id});
        } else {
            // Invalid credentials
            res.status(401).send('Invalid credentials');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



//adding task to corressponding user's collection 
router.post('/api/addTask', async (req, res) => {
    try {

        console.log("hello")
        const { userId, description,completed } = req.body;

        // Check if the model has already been compiled
        let TaskModel;
        try {
            TaskModel = mongoose.model(`Task_${userId}`);
        } catch (error) {
            // Model doesn't exist, create it
            TaskModel = mongoose.model(`Task_${userId}`, {
                user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
                description: { type: String, required: true },
                completed: { type: Boolean, default: false },
                // Add other task-related fields if needed
            });
        }

        // Create a new task and save it to the user-specific collection
        const newTask = new TaskModel({
            user: userId,
            description,
            completed,
            // Add other task-related fields if needed
        });

        await newTask.save();

        res.status(201).json({ message: 'Task added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/api/getTasks/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        const TaskModel = mongoose.model(`Task_${userId}`);

        const tasks = await TaskModel.find({ user: userId });

        res.status(200).json({ tasks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});





router.put('/api/markComplete/:taskId', async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const userId = req.user._id;

        const TaskModel = mongoose.model(`Task_${userId}`);

        const task = await TaskModel.findByIdAndUpdate(taskId, { completed: true }, { new: true });

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.status(200).json({ message: 'Task marked as complete', task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.delete('/api/deleteTask/:taskId', async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const userId = req.user._id;

        const TaskModel = mongoose.model(`Task_${userId}`);

        const task = await TaskModel.findByIdAndDelete(taskId);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



router.get('/api/forgetPassowrd', async (req, res) => {
    try {
     
        res.render('forgetPassword');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



router.post('/api/verifyOTP', (req, res) => {
    const { verificationSid, otp } = req.body;
  
    // Step 3: Verify OTP using Twilio Verify API
    client.verify.v2.services(verifyServiceSid)
      .verificationChecks.create({ verificationSid: verificationSid, code: otp })
      .then((verificationCheck) => {
        console.log('Verification check status:', verificationCheck.status);
        if (verificationCheck.status === 'routerroved') {
          return res.json({ message: 'OTP verified successfully.' });
        } else {
          return res.status(400).json({ error: 'Invalid OTP.' });
        }
      })
      .catch((error) => {
        console.error('Error verifying OTP:', error);
        return res.status(500).json({ error: 'Failed to verify OTP.' });
      });
});
  




router.post('/api/sendOTP', (req, res) => {


    const accountSid = process.env.accountSid;
    const authToken = process.env.authToken;
    const verifySid = process.env.verifySid;
    const client = require("twilio")(accountSid, authToken);
    
    client.verify.v2
      .services(verifySid)
      .verifications.create({ to: "+918797256155", channel: "sms" })
      .then((verification) => console.log(verification.status))
      .then(() => {
        const readline = require("readline").createInterface({
          input: process.stdin,
          output: process.stdout,
        });
        readline.question("Please enter the OTP:", (otpCode) => {
          client.verify.v2
            .services(verifySid)
            .verificationChecks.create({ to: "+918797256155", code: otpCode })
            .then((verification_check) => console.log(verification_check.status))
            .then(() => readline.close());
        });
      });
    

  
});
  
  
module.exports = router;
