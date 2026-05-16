const router = require('express').Router()
const { CreateTask, FetchAllTask ,ShowTask,DeleteTask,UpdateTask} = require('../Controllers/TaskController')
//to get all teh task
router.get('/fetchtask',FetchAllTask )
router.get('/showtask/:taskid',ShowTask )

//to create task 
router.post('/CreateTask',CreateTask)

//to  update a task
router.put('/updatetask/:taskid',UpdateTask)

//to delete a task
router.delete('/deletetask/:taskid',DeleteTask)
module.exports = router;