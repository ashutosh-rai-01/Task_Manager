import React, { useState, useEffect, useMemo } from "react";
import Badge from "../components/Badge";
import { Link } from "react-router-dom";
import Task from "../components/Task";
import { useAuth } from "../context/AuthContext";

const TaskListPage = () => {
  const { token, logout } = useAuth();
  const [tasks, setTasks] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const getTask = async () => {
      try {
        const responce = await fetch(`${import.meta.env.VITE_API_BASE_URL}/task/fetchtask`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        if (responce.status === 401) {
          logout();
          return;
        }
        const responcedata = await responce.json()
        setTasks(responcedata)
      } catch (err) {
        console.error("Fetch tasks error:", err);
      }
    }
    getTask()
  }, [token, logout])

  const handleDelete = (taskId) => {
    setTasks(prev => ({
      ...prev,
      taskdata: prev.taskdata.filter(task => task._id !== taskId)
    }));
  };

  // Helper to check if a date falls within the current week (Sunday - Saturday)
  const isDateInCurrentWeek = (dateStr) => {
    if (!dateStr) return false;
    const taskDate = new Date(dateStr);
    const today = new Date();
    
    // Start of week (Sunday)
    const startOfWeek = new Date(today);
    const day = today.getDay();
    startOfWeek.setDate(today.getDate() - day);
    startOfWeek.setHours(0, 0, 0, 0);
    
    // End of week (Saturday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    return taskDate >= startOfWeek && taskDate <= endOfWeek;
  };


  const weeklyStats = useMemo(() => {
    const stats = {
      completed: 0,
      pending: 0,
      running: 0,
      failed: 0,
      notCompleted: 0,
      total: 0
    };

    if (!tasks || !tasks.success) return stats;

    tasks.taskdata.forEach(task => {
      if (isDateInCurrentWeek(task.date)) {
        stats.total++;
        if (task.status === "Completed") {
          stats.completed++;
        } else {
          stats.notCompleted++;
          if (task.status === "Pending") stats.pending++;
          else if (task.status === "Running") stats.running++;
          else if (task.status === "Failed") stats.failed++;
        }
      }
    });

    return stats;
  }, [tasks]);


  // Helper arrays/functions for Calendar
  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysCount = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    // Leading empty cells
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
   
    for (let day = 1; day <= daysCount; day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isSelected = (date) => {
    if (!date || !selectedDate) return false;
    return date.getFullYear() === selectedDate.getFullYear() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getDate() === selectedDate.getDate();
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.getFullYear() === today.getFullYear() &&
           date.getMonth() === today.getMonth() &&
           date.getDate() === today.getDate();
  };

  // Memoized check for dates that have tasks
  const daysWithTasks = useMemo(() => {
    if (!tasks || !tasks.success) return new Set();
    const dates = new Set();
    tasks.taskdata.forEach(task => {
      if (task.date) {
        const d = new Date(task.date);
        dates.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
      }
    });
    return dates;
  }, [tasks]);

  const hasTasksOnDate = (date) => {
    if (!date) return false;
    return daysWithTasks.has(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);
  };

  // Local filtering based on selected date
  const filteredTasks = useMemo(() => {
    if (!tasks || !tasks.success) return [];
    if (!selectedDate) return tasks.taskdata;
    
    return tasks.taskdata.filter(task => {
      if (!task.date) return false;
      const d = new Date(task.date);
      return d.getFullYear() === selectedDate.getFullYear() &&
             d.getMonth() === selectedDate.getMonth() &&
             d.getDate() === selectedDate.getDate();
    });
  }, [tasks, selectedDate]);

  return (
    <div className="pt-5">
      <h1 className="text-2xl font-bold mb-5 text-slate-800">My Tasks</h1>

      {/* Weekly Stats Panel */}
      <div className="mb-6">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
          This Week's Activity Report
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3.5 flex flex-col justify-between shadow-sm hover:scale-[1.02] transition-transform">
            <span className="text-xs font-bold text-emerald-600">Completed</span>
            <span className="text-2xl font-bold text-emerald-800 mt-2">{weeklyStats.completed}</span>
          </div>
          
          <div className="bg-sky-50 border border-sky-100 rounded-xl p-3.5 flex flex-col justify-between shadow-sm hover:scale-[1.02] transition-transform">
            <span className="text-xs font-bold text-sky-600">Pending</span>
            <span className="text-2xl font-bold text-sky-800 mt-2">{weeklyStats.pending}</span>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3.5 flex flex-col justify-between shadow-sm hover:scale-[1.02] transition-transform">
            <span className="text-xs font-bold text-amber-600">Running</span>
            <span className="text-2xl font-bold text-amber-800 mt-2">{weeklyStats.running}</span>
          </div>

          <div className="bg-rose-50 border border-rose-100 rounded-xl p-3.5 flex flex-col justify-between shadow-sm hover:scale-[1.02] transition-transform">
            <span className="text-xs font-bold text-rose-600">Failed</span>
            <span className="text-2xl font-bold text-rose-800 mt-2">{weeklyStats.failed}</span>
          </div>

          <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3.5 flex flex-col justify-between shadow-sm hover:scale-[1.02] transition-transform col-span-2 sm:col-span-1">
            <span className="text-xs font-bold text-slate-500">Not Completed</span>
            <span className="text-2xl font-bold text-slate-700 mt-2">{weeklyStats.notCompleted}</span>
          </div>
        </div>
      </div>

      {/* Interactive Calendar Panel */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-800">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <div className="flex gap-2">
            <button 
              onClick={prevMonth} 
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
              title="Previous Month"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={nextMonth} 
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
              title="Next Month"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
            <span key={d} className="text-xs font-bold text-slate-400 py-1">{d}</span>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-center">
          {getDaysInMonth(currentMonth).map((date, idx) => {
            if (!date) return <div key={`empty-${idx}`} />;
            
            const active = isSelected(date);
            const today = isToday(date);
            const hasTasks = hasTasksOnDate(date);
            
            return (
              <button
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                className={`h-9 w-9 mx-auto rounded-lg flex flex-col items-center justify-center relative text-sm font-medium transition-all duration-200 cursor-pointer ${
                  active 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-105" 
                    : today
                      ? "border border-blue-500 text-blue-600 hover:bg-blue-50"
                      : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span>{date.getDate()}</span>
                {hasTasks && (
                  <span className={`h-1 w-1 rounded-full absolute bottom-1 ${active ? "bg-white" : "bg-blue-500"}`} />
                )}
              </button>
            );
          })}
        </div>
        
        {selectedDate && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
            <span className="text-slate-500">
              Showing tasks for: <span className="font-semibold text-blue-600">{selectedDate.toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
            </span>
            <button 
              onClick={() => setSelectedDate(null)}
              className="text-blue-600 hover:underline font-semibold cursor-pointer"
            >
              Show All Tasks
            </button>
          </div>
        )}
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {tasks && tasks.success ? (
          filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <Task key={task._id || Math.random()} {...task} onDelete={handleDelete} />
            ))
          ) : (
            <div className="text-center py-10 bg-slate-50 border border-dashed rounded-xl">
              <p className="text-slate-400 font-medium">No tasks scheduled for this date.</p>
              {selectedDate && (
                <button 
                  onClick={() => setSelectedDate(null)}
                  className="mt-2 text-sm text-blue-600 hover:underline font-semibold cursor-pointer"
                >
                  Clear filter to see all tasks
                </button>
              )}
            </div>
          )
        ) : (
          <p className="text-gray-500">Loading tasks....</p>
        )}
      </div>
    </div>
  );
};

export default TaskListPage;