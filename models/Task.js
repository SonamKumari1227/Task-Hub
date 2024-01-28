const mongoose = require("mongoose");
const validator = require("validator");

const taskSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: {
        type: String,
        required: true,
        trim: true,
        
      
    },
    completed: { type: Boolean, default: false },
   
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;



