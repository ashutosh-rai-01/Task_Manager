import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Badge from './Badge';

const Task = (props) => {
        const [badgecolor , setbadgecolor] = useState()
        useEffect(() =>{
            if (props.status === 'Pending'){
                setbadgecolor('blue')
            }
            else if (props.status === 'Running'){
                setbadgecolor('yellow')
            }
            else if (props.status === 'Completed'){
                setbadgecolor('green')
            }
            else if(props.status === 'Pending'){
                setbadgecolor('red')
    }
        },[props.status])
  return (
    <div>
      <div className="border p-3 rounded-md mb-5 bg-white shadow-sm">
        <h3 className="text-lg font-semibold flex items-center">
          <span className="me-2">
            {props.title}
          </span>
          <Badge props={{ color: badgecolor, text: props.status || "Pending" }} />
        </h3>
        <p className="line-clamp-2 mb-3 text-gray-600">
          {props.description}
        </p>
        <div className="flex gap-3 items-center mt-4">
          <Link to={`/showtask/${props._id}`} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center inline-flex items-center p-2 transition-transform active:scale-95">
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
          <button className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm text-center inline-flex items-center p-2 transition-transform active:scale-95">
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
