import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Badge from '../components/Badge';
import { useAuth } from '../context/AuthContext';

const Showtask = () => {
  const { taskid } = useParams();
  const { token, logout } = useAuth();
  const [task, setTask] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/task/showtask/${taskid}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (response.status === 401) {
          logout();
          return;
        }
        const data = await response.json();
        if (response.ok && data.success) {
          setTask(data.data);
        } else {
          setError(data.message || 'Failed to fetch task');
        }
      } catch (err) {
        setError('Server error while fetching task');
        console.error(err);
      }
    };
    fetchTask();
  }, [taskid, token, logout]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/task/updatetask/${taskid}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          title: task.title, 
          description: task.description, 
          status: newStatus 
        })
      });
      if (response.status === 401) {
        logout();
        return;
      }
      const data = await response.json();
      if (response.ok && data.success) {
        setTask(data.data);
      } else {
        alert(data.message || "Failed to update status");
      }
    } catch (err) {
      alert("Server error while updating status");
      console.error(err);
    }
  };

  if (error) {
    return <div className="pt-5 text-red-500">{error}</div>;
  }

  if (!task) {
    return <div className="pt-5 text-gray-500">Loading task...</div>;
  }

  let badgecolor = 'blue';
  if (task.status === 'Running') badgecolor = 'yellow';
  if (task.status === 'Completed') badgecolor = 'green';
  if (task.status === 'Failed') badgecolor = 'red';

  return (
    <div className="pt-5">
      <Link to="/task-list" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Tasks</Link>
      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 mt-2 relative">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 pr-20 break-words">{task.title}</h1>
        <div className="absolute top-6 right-6 flex items-center gap-3">
            <select 
              value={task.status || "Pending"}
              onChange={handleStatusChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5 cursor-pointer"
            >
              <option value="Pending">Pending</option>
              <option value="Running">Running</option>
              <option value="Completed">Completed</option>
              <option value="Failed">Failed</option>
            </select>
            <Badge props={{ color: badgecolor, text: task.status || "Pending" }} />
        </div>
        <p className="text-gray-700 text-lg mb-6 whitespace-pre-wrap break-words">
          {task.description}
        </p>
        <div className="text-sm text-gray-500 mt-8 border-t pt-4">
          <p className="mb-1">Scheduled Date: <span className="font-semibold text-slate-800">{task.date ? new Date(task.date).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'Today'}</span></p>
          <p>Created At: {new Date(task.createdAt).toLocaleString()}</p>
          <p>Last Updated: {new Date(task.updatedAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Showtask;
