import React from 'react'
import { BrowserRouter , Route , Routes } from 'react-router-dom'
import HomePage from './pages/Homepage'
import TaskListPage from './pages/TaskListPAge'
import Layout from './components/Layout'
import Showtask from './pages/Showtask'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route path='/' element={<Layout/>}>
          <Route index element={<HomePage/>}/>
          <Route path='/task-list' element={<TaskListPage/>}/>
          <Route path='/show-task/:taskid' element={<Showtask/>}/>

          
        </Route>
        
      </Routes>
    </BrowserRouter>
  )
}

export default App

