const TaskModel = require("../Models/TaskModel")

const CreateTask = async (req, res) => {
    try {
        const { title, description, status, date } = req.body;
        
        if (!title || !description || !date) {
            return res.status(400).json({ 
                message: 'Title, description, and date are required', 
                success: false 
            });
        }

        const task = new TaskModel({ 
            title, 
            description, 
            status, 
            date,
            user: req.user.id 
        });
        await task.save();
        res.status(201).json({ message: 'Task created successfully', success: true, data: task });
    } catch (err) {
        console.error('CreateTask Error:', err);
        res.status(500).json({
            message: 'Failed to create task', success: false, error: err.message
        });
    }
}

const FetchAllTask = async (req, res) => {
    try {
        const taskdata = await TaskModel.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ message: 'ALL TASK', success: true, taskdata });
    } catch (err) {
        console.error('FetchAllTask Error:', err);
        res.status(500).json({
            message: 'Failed to fetch tasks', success: false, error: err.message
        });
    }
}

const ShowTask = async (req, res) => {
    try {
        const id = req.params.taskid;
        const data = await TaskModel.findOne({ _id: id, user: req.user.id });
        if (!data) {
            return res.status(404).json({ message: 'Task not found', success: false });
        }
        res.status(200).json({ message: 'TASK FOUND', success: true, data });
    } catch (err) {
        console.error('ShowTask Error:', err);
        res.status(500).json({
            message: 'Failed to show task', success: false, error: err.message
        });
    }
}

const UpdateTask = async (req, res) => {
    try {
        const { taskid } = req.params;
        const { title, description, status, date } = req.body;

        const taskdata = await TaskModel.findOneAndUpdate(
            { _id: taskid, user: req.user.id }, 
            { title, description, status, date }, 
            { new: true }
        );
        
        if (!taskdata) {
            return res.status(404).json({ message: 'Task not found', success: false });
        }

        res.status(200).json({ message: 'Task Updated Successfully', success: true, data: taskdata });
    } catch (err) {
        console.error('UpdateTask Error:', err);
        res.status(500).json({
            message: 'Failed to Update task', success: false, error: err.message
        });
    }
}

const DeleteTask = async (req, res) => {
    try {
        const id = req.params.taskid;
        const task = await TaskModel.findOneAndDelete({ _id: id, user: req.user.id });
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found', success: false });
        }

        res.status(200).json({ message: 'Task is deleted', success: true });
    } catch (err) {
        console.error('DeleteTask Error:', err);
        res.status(500).json({
            message: 'Failed to delete task', success: false, error: err.message
        });
    }
}

module.exports = {
    CreateTask, FetchAllTask, UpdateTask, DeleteTask, ShowTask
}