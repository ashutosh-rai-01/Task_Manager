const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    title:{
        type:String , 
        required:true,
    },
    description:{
        type:String,
        required: true,
    },
    status:{
        type:String,
        required:true,
        default:'Pending',
        enum:['Pending' , 'Running','Completed','Failed']
    },
    date:{
        type: Date,
        required: true,
        default: Date.now
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},{timestamps:true})

const TaskModel = mongoose.model('Task', TaskSchema,'Tasks')
module.exports = TaskModel;