import React from 'react'
import { Route,Routes } from 'react-router-dom'
import Home from './components/Home/page'
import RiverTimeline from './components/TimeLine/page'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path='/river' element={<RiverTimeline/>} />
    </Routes>
  )
}

export default App
