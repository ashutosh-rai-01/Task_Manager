import React from "react";
import { NavLink } from "react-router-dom";
import { RouteIndex, RouteTaskList } from "../helper/RouterName";
import { useAuth } from "../context/AuthContext";

const Navigation = () => {
  const { user, logout } = useAuth();

  const buttonClass =
    "py-2.5 px-5 me-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 transition-colors cursor-pointer";

  const activeButtonClass =
    "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 focus:outline-none transition-colors cursor-pointer";

  return (
    <div className="pb-5 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex gap-2">
        <NavLink
          to={RouteIndex}
          className={({ isActive }) =>
            isActive ? activeButtonClass : buttonClass
          }
        >
          Add Task
        </NavLink>
        <NavLink
          to={RouteTaskList}
          className={({ isActive }) =>
            isActive ? activeButtonClass : buttonClass
          }
        >
          My Tasks
        </NavLink>
      </div>

      {user && (
        <div className="flex items-center gap-4 self-stretch sm:self-auto justify-between border-t sm:border-t-0 pt-3 sm:pt-0">
          <div className="text-sm">
            <span className="text-gray-500">Logged in as: </span>
            <span className="font-semibold text-gray-800">{user.name}</span>
          </div>
          <button
            onClick={logout}
            className="text-xs font-semibold text-red-600 hover:text-white hover:bg-red-600 border border-red-600 hover:border-transparent rounded-lg px-3 py-1.5 transition-all duration-200 cursor-pointer"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Navigation;