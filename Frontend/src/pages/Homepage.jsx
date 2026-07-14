import React, { useState } from "react";
import { z } from "zod";
import { getZoderror } from "../helper/getZoderror";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const { token, logout } = useAuth();
  const [formdata, setformdata] = useState({ 
    title: "", 
    description: "", 
    date: new Date().toISOString().split('T')[0] 
  });
  const [err, seterr] = useState({});
  const [toast, setToast] = useState(null);

  const taskschema = z.object({
    title: z.string().min(3, { message: "title must be atleast 3 chratcers long" }),
    description: z.string().min(3, { message: "Description must be atleast 3 characters long " }).max(500, { message: "length exceeded" }),
    date: z.string().min(1, { message: "Date is required" })
  });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleInput = (e) => {
    setformdata({ ...formdata, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const validatedata = taskschema.parse(formdata);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/task/CreateTask`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(validatedata)
      });

      if (response.status === 401) {
        logout();
        return;
      }

      const responseData = await response.json();

      if (response.ok && responseData.success) {
        showToast(" Task created successfully!");
        setformdata({ 
          title: "", 
          description: "", 
          date: new Date().toISOString().split('T')[0] 
        });
        seterr({});
      } else {
        showToast(responseData.message || "Failed to create task", "error");
      }
    } catch (err) {
      // if(err instanceof z.ZodError){
      //   const geterror = getZoderror(err.issues);
      //   seterr(geterror)
      // }
      // else{
      // console.log(err)};
      if (err instanceof z.ZodError) {

        console.log(err.issues);

        const geterror = getZoderror(err.issues);

        seterr(geterror);
      } else {
        console.error("Submission error:", err);
        showToast("Server error. Is your backend running?", "error");
      }
    }
  };

  return (
    <div className="pt-5 relative">
      <h1 className="text-2xl font-bold mb-5">Add Task</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900 ">
            Title
          </label>
          <input
            name="title"
            type="text"
            onChange={handleInput}
            value={formdata?.title ||''}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors"
            placeholder="Task title"
          />
          {err?.title && <p className="text-red-500 text-sm mt-1">{err.title + "*"}</p>}
        </div>
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900 ">
            Description
          </label>
          <textarea
            name="description"
            onChange={handleInput}
            value={formdata?.description ||''}
            rows="4"
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Task description..."
          ></textarea>
          {err?.description && <p className="text-red-500 text-sm mt-1">{err.description + "*"}</p>}
        </div>
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900 ">
            Date
          </label>
          <input
            name="date"
            type="date"
            onChange={handleInput}
            value={formdata?.date || ''}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors cursor-pointer"
          />
          {err?.date && <p className="text-red-500 text-sm mt-1">{err.date + "*"}</p>}
        </div>

        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center transition-transform active:scale-95"
        >
          Submit
        </button>
      </form>

  
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center p-4 text-sm rounded-lg shadow-lg transform transition-all duration-300 ease-in-out ${
            toast.type === "success"
              ? "text-green-800 border border-green-300 bg-green-50"
              : "text-red-800 border border-red-300 bg-red-50"
          }`}
          role="alert"
        >
          {toast.type === "success" ? (
            <svg className="flex-shrink-0 inline w-5 h-5 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
            </svg>
          ) : (
            <svg className="flex-shrink-0 inline w-5 h-5 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
            </svg>
          )}
          <span className="sr-only">Info</span>
          <div className="font-medium">
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;