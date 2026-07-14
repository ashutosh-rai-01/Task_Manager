import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/Homepage'
import TaskListPage from './pages/TaskListPAge'
import Layout from './components/Layout'
import Showtask from './pages/Showtask'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import { RouteIndex, RouteTaskList, RouteLogin, RouteRegister } from './helper/RouterName'

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path={RouteLogin} element={<Login />} />
          <Route path={RouteRegister} element={<Register />} />

          {/* Protected App Routes */}
          <Route path={RouteIndex} element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<HomePage />} />
            <Route path={RouteTaskList} element={<TaskListPage />} />
            <Route path="/show-task/:taskid" element={<Showtask />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

