import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Badge from './Badge';
import { useAuth } from '../context/AuthContext';

const Task = (props) => {
        const { token, logout } = useAuth();
        const [currentStatus, setCurrentStatus] = useState(props.status || 'Pending');
        const [badgecolor , setbadgecolor] = useState()
        useEffect(() =>{
            if (currentStatus === 'Pending'){
                setbadgecolor('blue')
            }
            else if (currentStatus === 'Running'){
                setbadgecolor('yellow')
            }
            else if (currentStatus === 'Completed'){
                setbadgecolor('green')
            }
            else if(currentStatus === 'Failed'){
                setbadgecolor('red')
            }
        },[currentStatus])

        const handleStatusChange = async (e) => {
          const newStatus = e.target.value;
          try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/task/updatetask/${props._id}`, {
              method: "PUT",
              headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
              body: JSON.stringify({ 
                title: props.title, 
                description: props.description, 
                status: newStatus 
              })
            });
            if (response.status === 401) {
              logout();
              return;
            }
            const data = await response.json();
            if (response.ok && data.success) {
              setCurrentStatus(newStatus);
            } else {
              alert(data.message || "Failed to update status");
            }
          } catch (err) {
            alert("Server error while updating status");
            console.error(err);
          }
        };
  return (
    <div>
      <div className="border p-3 rounded-md mb-5 bg-white shadow-sm">
        <h3 className="text-lg font-semibold flex items-center justify-between">
          <span className="me-2">
            {props.title}
          </span>
          <div className="flex items-center gap-2">
            <select 
              value={currentStatus}
              onChange={handleStatusChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1 cursor-pointer"
            >
              <option value="Pending">Pending</option>
              <option value="Running">Running</option>
              <option value="Completed">Completed</option>
              <option value="Failed">Failed</option>
            </select>
            <Badge props={{ color: badgecolor, text: currentStatus }} />
          </div>
        </h3>
        <p className="line-clamp-2 mb-2 text-gray-600">
          {props.description}
        </p>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3 bg-slate-50 border border-slate-100 rounded-md px-2 py-1 w-fit">
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <span>Scheduled: <span className="font-semibold text-slate-700">{props.date ? new Date(props.date).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'Today'}</span></span>
        </div>
        <div className="flex gap-3 items-center mt-4">
          <Link to={`/show-task/${props._id}`} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center inline-flex items-center p-2 transition-transform active:scale-95">
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeWidth="2"
                d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"
              />
              <path
                stroke="currentColor"
                strokeWidth="2"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </Link>
          <button 
            onClick={async () => {
              if (window.confirm("Are you sure you want to delete this task?")) {
                try {
                  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/task/deletetask/${props._id}`, {
                    method: "DELETE",
                    headers: {
                      "Authorization": `Bearer ${token}`
                    }
                  });
                  if (res.status === 401) {
                    logout();
                    return;
                  }
                  const data = await res.json();
                  if (res.ok && data.success) {
                    if(props.onDelete) props.onDelete(props._id);
                  } else {
                    alert(data.message || "Failed to delete task");
                  }
                } catch (err) {
                  console.error(err);
                  alert("Server error while deleting task");
                }
              }
            }}
            className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm text-center inline-flex items-center p-2 transition-transform active:scale-95">
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Task;
