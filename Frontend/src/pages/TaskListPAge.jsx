import React, { useState, useEffect } from "react";
import Badge from "../components/Badge";
import { Link } from "react-router-dom";
import Task from "../components/Task";

const TaskListPage = () => {
  const [tasks, setTasks] = useState(null);
  useEffect(()=>{
    const getTask = async ()=>{
      const responce = await fetch(`${import.meta.env.VITE_API_BASE_URL}/task/fetchtask`)
      const responcedata = await responce.json()
      setTasks(responcedata)
      }
    getTask()
  }, [])
  return (
    <div className="pt-5">
      <h1 className="text-2xl font-bold mb-5">My Tasks</h1>
      {tasks && tasks.success ? (
        tasks.taskdata.map((task) => <Task key={task._id || Math.random()} props={task} />)
      ) : (
        <p className="text-gray-500">Loading....</p>
      )}
    </div>
  );
};

export default TaskListPage;