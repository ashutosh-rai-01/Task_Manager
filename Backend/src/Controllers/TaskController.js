const TaskModel = require("../Models/TaskModel")

const CreateTask = async (req,res)=>{
    try{
        const { title, description, status } = req.body;
        
        if (!title || !description) {
            return res.status(400).json({ 
                message: 'Title and description are required', 
                success: false 
            });
        }

        const task = new TaskModel({ title, description, status });
        await task.save();
        res.status(201).json({ message: 'Task created successfully', success: true, data: task });
    }catch (err){
        console.error('CreateTask Error:', err);
        res.status(500).json({
            message: 'Failed to create task', success:false, error: err.message
        })
    }
}

const FetchAllTask = async (req,res)=>{
    try{
        const taskdata = await TaskModel.find().sort({ createdAt: -1 });
        res.status(200).json({message:'ALL TASK' ,success:true, taskdata});
    }catch (err){
        console.error('FetchAllTask Error:', err);
        res.status(500).json({
            message: 'Failed to fetch tasks', success:false, error: err.message
        })
    }
}

const ShowTask = async (req,res)=>{
    try{
        const id = req.params.taskid;
        const data = await TaskModel.findById(id);
        res.status(200).json({message:'TASK FOUND' ,success:true, data});
    }catch (err){
        console.error('ShowTask Error:', err);
        res.status(500).json({
            message: 'Failed to show task', success:false, error: err.message
        })
    }
}

const UpdateTask = async (req,res)=>{
    try{
        const { taskid } = req.params;
        const { title, description, status } = req.body;

        const taskdata = await TaskModel.findByIdAndUpdate(
            taskid, 
            { title, description, status }, 
            { new: true }
        );
        
        if (!taskdata) {
            return res.status(404).json({ message: 'Task not found', success: false });
        }

        res.status(200).json({ message: 'Task Updated Successfully', success: true, data: taskdata });
    }catch (err){
        console.error('UpdateTask Error:', err);
        res.status(500).json({
            message: 'Failed to Update task', success:false, error: err.message
        })
    }
}

const DeleteTask = async (req,res)=>{
    try{
        const id = req.params.taskid
        const task = await TaskModel.findByIdAndDelete(id)
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found', success: false });
        }

        res.status(200).json({message:'Task is deleted' ,success:true})
    }catch (err){
        console.error('DeleteTask Error:', err);
        res.status(500).json({
            message: 'Failed to delete task', success:false, error: err.message
        })
    }
}



module.exports = {
    CreateTask,FetchAllTask , UpdateTask , DeleteTask,ShowTask
}